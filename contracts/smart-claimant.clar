;; Data Variables
(define-data-var beneficiaries (optional (list 10 principal)) none)

;; Error Constants
(define-constant err-already-initialized (err u300))
(define-constant err-not-initialized (err u301))
(define-constant err-unauthorized (err u302))

(define-public (setup-and-bestow (new-list (list 10 principal)))
    (let ((current-beneficiary (contract-call? .timelocked-wallet get-beneficiary)))
        (begin
            (asserts! (is-eq (some tx-sender) current-beneficiary)
                err-unauthorized
            )

            (asserts! (is-none (var-get beneficiaries)) err-already-initialized)

            (var-set beneficiaries (some new-list))

            (try! (contract-call? .timelocked-wallet bestow (as-contract tx-sender)))

            (ok true)
        )
    )
)

(define-public (smart-claim)
    (let (
            (recipients (unwrap! (var-get beneficiaries) err-not-initialized))
            (n (len recipients))
        )
        (begin
            (asserts! (is-some (index-of recipients tx-sender)) err-unauthorized)

            (try! (as-contract (contract-call? .timelocked-wallet claim)))

            (let (
                    (total-balance (stx-get-balance (as-contract tx-sender)))
                    (share (/ total-balance n))
                )
                (fold distribute-share recipients share)

                (let ((remaining (stx-get-balance (as-contract tx-sender))))
                    (if (> remaining u0)

                        (as-contract (stx-transfer? remaining tx-sender
                            (unwrap-panic (element-at recipients (- n u1)))
                        ))
                        (ok true)
                    )
                )
            )
        )
    )
)

(define-private (distribute-share
        (recipient principal)
        (amount uint)
    )
    (begin
        ;; Intentamos transferir. Si falla uno, unwrap-panic aborta todo.
        (unwrap-panic (as-contract (stx-transfer? amount tx-sender recipient)))
        amount ;; Devolvemos el amount para que fold siga su camino
    )
)
