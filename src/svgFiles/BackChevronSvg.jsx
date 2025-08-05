import React from 'react'

export const BackChevronSvg = ({onClick, className}) => {
    return (
        <svg onClick={onClick} className={className} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="white" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.7071 9.95952C19.0976 10.35 19.0976 10.9832 18.7071 11.3737L14.0808 16L18.7071 20.6262C19.0976 21.0167 19.0976 21.6499 18.7071 22.0404C18.3165 22.4309 17.6834 22.4309 17.2929 22.0404L11.9595 16.7071C11.569 16.3165 11.569 15.6834 11.9595 15.2929L17.2929 9.95952C17.6834 9.56899 18.3165 9.56899 18.7071 9.95952Z" fill="black" />
        </svg>

    )
}
