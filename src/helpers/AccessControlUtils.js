export const jwtDecode = (token) => {
    try {
        // const token = localStorage.getItem("authToken");
        if (!token) {  // Handle the case where no token exists
            return null; // or redirect, or throw an error, depending on your needs
        }
        const arrayToken = token.split('.');
        return JSON.parse(atob(arrayToken[1]));
    } catch (error) {
        // If Parsing token results in error means token is malformed and user must return to login screen
        console.error("Error decoding token:", error); // Log the error for debugging
        window.location.href = '/login';
        return null; // Return null to prevent further errors
    }
};

export const isTokenExpired = () => {
    return jwtDecode()?.exp < (Date.now() / 1000);
};

export const getExpandedAuthorities = (authorities = []) => {
    if (authorities.length === 0) {
        return [];
    }
    let expandedAuthorities = [];
    authorities?.forEach(cur => {
        const [permissionSuffix, permissionPrefix] = cur.split("-");
        if (permissionPrefix && permissionPrefix.length > 1) { // Check if permissionPrefix exists
            const permission = permissionPrefix.split("").map(per => `${permissionSuffix}-${per}`);
            expandedAuthorities.push(...permission);
        } else {
            expandedAuthorities.push(cur);
        }
    });
    return expandedAuthorities;
};

export const hasPermission = (permissions, isMatchAll = false) => {
    const decodedToken = jwtDecode();
    if (!decodedToken || !decodedToken.grantedAuthorities) { // Handle cases where token is invalid or doesn't have authorities
        return false;
    }
    const grantedAuthorities = getExpandedAuthorities(decodedToken.grantedAuthorities);

    return isMatchAll
        ? permissions.every(permission => grantedAuthorities.includes(permission))
        : permissions.some(userPermission => grantedAuthorities.includes(userPermission));
};