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