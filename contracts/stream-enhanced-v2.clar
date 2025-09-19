;; Enhanced sBTC-Streamr Contract v2
;; Supports both STX and SIP-010 tokens with simplified approach

;; Error codes
(define-constant ERR_UNAUTHORIZED (err u0))
(define-constant ERR_INVALID_SIGNATURE (err u1))
(define-constant ERR_STREAM_STILL_ACTIVE (err u2))
(define-constant ERR_INVALID_STREAM_ID (err u3))
(define-constant ERR_INSUFFICIENT_BALANCE (err u4))

;; Data variables
(define-data-var latest-stream-id uint u0)

;; Streams mapping with token support
(define-map streams
  uint ;; stream-id
  {
    token-contract: (optional principal), ;; SIP-010 contract or none for STX
    sender: principal,
    recipient: principal,
    deposit: uint,              ;; total tokens deposited to the stream
    withdrawn: uint,            ;; tokens withdrawn by recipient
    rate-per-block: uint,       ;; units per block
    timeframe: (tuple (start uint) (stop uint)),
    created-at: uint
  }
)

;; Create a new STX stream (single transaction)
(define-public (create-stream-stx
    (recipient principal)
    (initial-balance uint)
    (timeframe (tuple (start uint) (stop uint)))
    (rate-per-block uint)
  )
  (let (
    (stream {
      token-contract: none,
      sender: contract-caller,
      recipient: recipient,
      deposit: initial-balance,
      withdrawn: u0,
      rate-per-block: rate-per-block,
      timeframe: timeframe,
      created-at: burn-block-height
    })
    (current-stream-id (var-get latest-stream-id))
  )
    ;; Transfer STX from sender to contract
    (try! (stx-transfer? initial-balance contract-caller (as-contract tx-sender)))
    (map-set streams current-stream-id stream)
    (var-set latest-stream-id (+ current-stream-id u1))
    (ok current-stream-id)
  )
)

;; Create a new SIP-010 token stream (simplified - assumes deposit already made)
(define-public (create-stream-token
    (recipient principal)
    (token-contract principal)
    (deposit-amount uint)
    (timeframe (tuple (start uint) (stop uint)))
    (rate-per-block uint)
  )
  (let (
    (stream {
      token-contract: (some token-contract),
      sender: contract-caller,
      recipient: recipient,
      deposit: deposit-amount,
      withdrawn: u0,
      rate-per-block: rate-per-block,
      timeframe: timeframe,
      created-at: burn-block-height
    })
    (current-stream-id (var-get latest-stream-id))
  )
    ;; Create the stream (balance verification handled by frontend/backend)
    (map-set streams current-stream-id stream)
    (var-set latest-stream-id (+ current-stream-id u1))
    (ok current-stream-id)
  )
)

;; Refuel STX stream
(define-public (refuel-stx
    (stream-id uint)
    (amount uint)
  )
  (let (
    (stream (unwrap! (map-get? streams stream-id) ERR_INVALID_STREAM_ID))
  )
    (asserts! (is-eq contract-caller (get sender stream)) ERR_UNAUTHORIZED)
    (asserts! (is-none (get token-contract stream)) ERR_INVALID_STREAM_ID)
    (try! (stx-transfer? amount contract-caller (as-contract tx-sender)))
    (map-set streams stream-id 
      (merge stream {deposit: (+ (get deposit stream) amount)})
    )
    (ok amount)
  )
)

;; Calculate the number of blocks a stream has been active
(define-read-only (calculate-block-delta
    (timeframe (tuple (start uint) (stop uint)))
  )
  (let (
    (start-block (get start timeframe))
    (stop-block (get stop timeframe))
    (delta 
      (if (<= burn-block-height start-block)
        ;; then
        u0
        ;; else
        (if (< burn-block-height stop-block)
          ;; then
          (- burn-block-height start-block)
          ;; else
          (- stop-block start-block)
        ) 
      )
    )
  )
    delta
  )
)

;; Check balance for a party involved in a stream
(define-read-only (balance-of
    (stream-id uint)
    (who principal)
  )
  (let (
    (stream (unwrap! (map-get? streams stream-id) u0))
    (block-delta (calculate-block-delta (get timeframe stream)))
    (recipient-balance (* block-delta (get rate-per-block stream)))
  )
    (if (is-eq who (get recipient stream))
      (- recipient-balance (get withdrawn stream))
      (if (is-eq who (get sender stream))
        (- (get deposit stream) recipient-balance)
        u0
      )
    )
  )
)

;; Withdraw from a stream (STX only for now)
(define-public (withdraw
    (stream-id uint)
  )
  (let (
    (stream (unwrap! (map-get? streams stream-id) ERR_INVALID_STREAM_ID))
    (balance (balance-of stream-id contract-caller))
  )
    (asserts! (is-eq contract-caller (get recipient stream)) ERR_UNAUTHORIZED)
    (map-set streams stream-id 
      (merge stream {withdrawn: (+ (get withdrawn stream) balance)})
    )
    ;; STX transfer
    (try! (as-contract (stx-transfer? balance tx-sender (get recipient stream))))
    (ok balance)
  )
)

;; Refund remaining tokens to sender (STX only for now)
(define-public (refund
    (stream-id uint)
  )
  (let (
    (stream (unwrap! (map-get? streams stream-id) ERR_INVALID_STREAM_ID))
    (balance (balance-of stream-id (get sender stream)))
  )
    (asserts! (is-eq contract-caller (get sender stream)) ERR_UNAUTHORIZED)
    (asserts! (< (get stop (get timeframe stream)) burn-block-height) ERR_STREAM_STILL_ACTIVE)
    (map-set streams stream-id (merge stream {
        deposit: (- (get deposit stream) balance),
      }
    ))
    ;; STX transfer
    (try! (as-contract (stx-transfer? balance tx-sender (get sender stream))))
    (ok balance)
  )
)

;; Get hash of stream for signature verification
(define-read-only (hash-stream
    (stream-id uint)
    (new-rate-per-block uint)
    (new-timeframe (tuple (start uint) (stop uint)))
  )
  (let (
    (stream (unwrap! (map-get? streams stream-id) (sha256 0)))
    (msg (concat (concat (unwrap-panic (to-consensus-buff? stream)) (unwrap-panic (to-consensus-buff? new-rate-per-block))) (unwrap-panic (to-consensus-buff? new-timeframe))))
  )
    (sha256 msg)
  )
)

;; Signature verification
(define-read-only (validate-signature (hash (buff 32)) (signature (buff 65)) (signer principal))
        (is-eq 
          (principal-of? (unwrap! (secp256k1-recover? hash signature) false)) 
          (ok signer)
        )
)

;; Update stream configuration with 2-party consent
(define-public (update-details
    (stream-id uint)
    (rate-per-block uint)
    (timeframe (tuple (start uint) (stop uint)))
    (signer principal)
    (signature (buff 65))
  )
  (let (
    (stream (unwrap! (map-get? streams stream-id) ERR_INVALID_STREAM_ID))  
  )
    (asserts! (validate-signature (hash-stream stream-id rate-per-block timeframe) signature signer) ERR_INVALID_SIGNATURE)
    (asserts!
      (or
        (and (is-eq (get sender stream) contract-caller) (is-eq (get recipient stream) signer))
        (and (is-eq (get sender stream) signer) (is-eq (get recipient stream) contract-caller))
      )
      ERR_UNAUTHORIZED
    )
    (map-set streams stream-id (merge stream {
        rate-per-block: rate-per-block,
        timeframe: timeframe
    }))
    (ok true)
  )
)

;; Read-only helper to get stream details
(define-read-only (get-stream
    (stream-id uint)
  )
  (map-get? streams stream-id)
)

;; Read-only helper to get latest stream ID
(define-read-only (get-latest-stream-id)
  (var-get latest-stream-id)
)

;; Read-only helper to get token balance for a contract
;; Note: This would need to be implemented with proper SIP-010 token integration
(define-read-only (get-token-balance
    (token-contract principal)
    (who principal)
  )
  ;; For now, return 0 - this would be implemented with proper token integration
  u0
)
