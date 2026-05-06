export const nameInputProperties = {
    autoCapitalize: "words",
    inputMode: "text",
    keyboardType: "default",
    placeholder: 'Name',
    maxLength: 24,
    secureTextEntry: false
} as const;

export const usernameInputProperties = {
    autoCapitalize: "none",
    inputMode: "text",
    keyboardType: "default",
    placeholder: 'Username',
    maxLength: 24,
    secureTextEntry: false
} as const;

export const emailInputProperties = {
    autoCapitalize: "none",
    inputMode: "email",
    keyboardType: "email-address",
    placeholder: 'Email',
    secureTextEntry: false
} as const;

export const passwordInputProperties = {
    autoCapitalize: "none",
    inputMode: "text",
    keyboardType: "default",
    placeholder: 'Password',
    secureTextEntry: true
} as const;

export const identifierInputProperties = {
    autoCapitalize: "none",
    inputMode: "text",
    keyboardType: "email-address",
    placeholder: 'Email or username',
    secureTextEntry: false
} as const;

export const tripNameInputProperties = {
    autoCapitalize: "words",
    inputMode: "text",
    keyboardType: "default",
    placeholder: 'Portugal Trip',
    maxLength: 32,
    secureTextEntry: false
} as const;

export const destinationInputProperties = {
    autoCapitalize: "words",
    inputMode: "text",
    keyboardType: "default",
    placeholder: 'Portugal',
    secureTextEntry: false
} as const;

export const searchInputProperties = {
    autoCapitalize: "none",
    inputMode: "text",
    keyboardType: "default",
    placeholder: 'Search',
    secureTextEntry: false
} as const;

export const floatInputProperties = {
    autoCapitalize: "none",
    autoCorrect: false,
    inputMode: "decimal",
    keyboardType: "decimal-pad",
    placeholder: "0.00€",
    secureTextEntry: false,
} as const;