export const UserPattern = {
    NAME_PATTERN: /^(?=.*[a-zA-Z])[0-9a-zA-Z_-]{3,15}$/,
    PASSWORD_PATTERN: /^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/,
    EMAIL_PATTERN: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    SIRET_PATTERN: /^[0-9]{14}$/,
    SIREN_PATTERN: /^[0-9]{9}$/,
    ZIP_CODE:  /^[0-9]{5}$/,
    ADDRESS_PATTERN: /^([a-zA-z0-9À-ÿ/\\''(),-\s])*$/,
    CITY_PATTERN: /^[a-zA-ZÀ-ÿ',.\s-]*$/,
};
