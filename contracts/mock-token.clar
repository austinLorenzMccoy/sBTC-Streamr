;; Mock SIP-010 Token Contract for Testing
;; This simulates sBTC or other SIP-010 tokens

;; Error codes
(define-constant ERR_UNAUTHORIZED (err u0))
(define-constant ERR_INSUFFICIENT_BALANCE (err u1))
(define-constant ERR_INVALID_AMOUNT (err u2))

;; Data variables
(define-data-var name (string-utf8 32) u"Mock Token")
(define-data-var symbol (string-utf8 32) u"MOCK")
(define-data-var decimals uint u6)
(define-data-var total-supply uint u1000000000000) ;; 1M tokens with 6 decimals

;; Balances mapping
(define-map balances principal uint)

;; Initialize balances for testing
(define-map initialized principal bool)

;; Initialize user balance (for testing)
(define-public (initialize-balance
    (user principal)
    (amount uint)
  )
  (let (
    (current-balance (default-to u0 (map-get? balances user)))
  )
    (map-set balances user (+ current-balance amount))
    (map-set initialized user true)
    (ok true)
  )
)

;; SIP-010 Standard Functions

;; Get token name
(define-read-only (get-name)
  (ok (var-get name))
)

;; Get token symbol
(define-read-only (get-symbol)
  (ok (var-get symbol))
)

;; Get token decimals
(define-read-only (get-decimals)
  (ok (var-get decimals))
)

;; Get total supply
(define-read-only (get-total-supply)
  (ok (var-get total-supply))
)

;; Get balance of a principal
(define-read-only (get-balance (who principal))
  (ok (default-to u0 (map-get? balances who)))
)

;; Transfer tokens
(define-public (transfer
    (amount uint)
    (sender principal)
    (recipient principal)
    (memo (optional (buff 34)))
  )
  (let (
    (sender-balance (default-to u0 (map-get? balances sender)))
  )
    (asserts! (is-eq tx-sender sender) ERR_UNAUTHORIZED)
    (asserts! (>= sender-balance amount) ERR_INSUFFICIENT_BALANCE)
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    
    (map-set balances sender (- sender-balance amount))
    (map-set balances recipient (+ (default-to u0 (map-get? balances recipient)) amount))
    (ok true)
  )
)

;; Mint tokens (for testing)
(define-public (mint
    (amount uint)
    (recipient principal)
  )
  (let (
    (current-balance (default-to u0 (map-get? balances recipient)))
  )
    (map-set balances recipient (+ current-balance amount))
    (ok true)
  )
)

;; Burn tokens (for testing)
(define-public (burn
    (amount uint)
    (owner principal)
  )
  (let (
    (owner-balance (default-to u0 (map-get? balances owner)))
  )
    (asserts! (is-eq tx-sender owner) ERR_UNAUTHORIZED)
    (asserts! (>= owner-balance amount) ERR_INSUFFICIENT_BALANCE)
    
    (map-set balances owner (- owner-balance amount))
    (ok true)
  )
)
