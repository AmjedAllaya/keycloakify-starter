import { useState, useEffect, useReducer } from "react";
import {
    Box,
    Button,
    Checkbox,
    CssBaseline,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography,
    ThemeProvider,
    createTheme
} from "@mui/material";
import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from "@mui/icons-material";

import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "keycloakify/tools/assert";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

// Create a modern, sophisticated theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#2A59A5', // Deep, professional blue
            light: '#4C7FCD',
            dark: '#1C3F6E'
        },
        background: {
            default: '#F4F7FA',
            paper: '#FFFFFF'
        },
        text: {
            primary: '#1A2138',
            secondary: '#4A5568'
        },
        mode: 'light'
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            color: '#1A2138',
            marginBottom: '1rem'
        },
        body1: {
            color: '#4A5568'
        }
    },
    shape: {
        borderRadius: 12
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    marginBottom: '1rem',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 12,
                    padding: '12px 24px',
                    fontWeight: 600
                }
            }
        }
    }
});

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const {
        social,
        realm,
        url,
        usernameHidden,
        login,
        auth,
        registrationDisabled,
        messagesPerField
    } = kcContext;

    const { msg, msgStr } = i18n;
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    height: '100vh',
                    overflow: 'hidden'
                }}
            >
                {/* Background Side */}
                <Box
                    sx={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #2A59A5 0%, #1C3F6E 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        padding: 4,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 400, mb: 4 }}>
                        Secure access to your account with our state-of-the-art authentication system
                    </Typography>
                    <Box
                        sx={{
                            width: 300,
                            height: 300,
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                width: 200,
                                height: 200,
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="100"
                                height="100"
                                fill="rgba(255,255,255,0.5)"
                            >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                            </svg>
                        </Box>
                    </Box>
                </Box>

                {/* Login Form Side */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 4,
                        backgroundColor: '#F4F7FA'
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 400,
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h4">
                            {msg("loginAccountTitle")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Sign in to continue to your account
                        </Typography>

                        {/* Social Providers Section */}
                        {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                            <Box sx={{ width: '100%', mb: 3 }}>
                                <Divider>
                                    <Typography variant="body2" color="text.secondary">
                                        {msg("identity-provider-login-label")}
                                    </Typography>
                                </Divider>
                                <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                                    {social.providers.map((p) => (
                                        <Grid item key={p.alias}>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                href={p.loginUrl}
                                                startIcon={p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} />}
                                                sx={{
                                                    textTransform: 'none',
                                                    borderRadius: 2
                                                }}
                                            >
                                                {p.displayName}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                        {/* Login Form */}
                        {realm.password && (
                            <form
                                id="kc-form-login"
                                onSubmit={() => {
                                    setIsLoginButtonDisabled(true);
                                    return true;
                                }}
                                action={url.loginAction}
                                method="post"
                                style={{ width: '100%' }}
                            >
                                {!usernameHidden && (
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label={
                                            !realm.loginWithEmailAllowed
                                                ? msg("username")
                                                : !realm.registrationEmailAsUsername
                                                    ? msg("usernameOrEmail")
                                                    : msg("email")
                                        }
                                        name="username"
                                        defaultValue={login.username ?? ""}
                                        autoComplete="username"
                                        autoFocus
                                        error={messagesPerField.existsError("username", "password")}
                                        helperText={
                                            messagesPerField.existsError("username", "password")
                                                ? kcSanitize(messagesPerField.getFirstError("username", "password"))
                                                : ""
                                        }
                                    />
                                )}

                                <PasswordWrapper
                                    kcClsx={kcClsx}
                                    i18n={i18n}
                                    passwordInputId="password"
                                    messagesPerField={messagesPerField}
                                />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                    {realm.rememberMe && !usernameHidden && (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="rememberMe"
                                                    color="primary"
                                                    defaultChecked={!!login.rememberMe}
                                                />
                                            }
                                            label={msg("rememberMe")}
                                        />
                                    )}

                                    {realm.resetPasswordAllowed && (
                                        <Link
                                            href={url.loginResetCredentialsUrl}
                                            variant="body2"
                                            color="primary"
                                        >
                                            {msg("doForgotPassword")}
                                        </Link>
                                    )}
                                </Box>

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    disabled={isLoginButtonDisabled}
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    {msgStr("doLogIn")}
                                </Button>

                                {realm.password && realm.registrationAllowed && !registrationDisabled && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                        {msg("noAccount")}{" "}
                                        <Link
                                            href={url.registrationUrl}
                                            variant="body2"
                                            color="primary"
                                        >
                                            {msg("doRegister")}
                                        </Link>
                                    </Typography>
                                )}

                                <input
                                    type="hidden"
                                    name="credentialId"
                                    value={auth.selectedCredential}
                                />
                            </form>
                        )}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

function PasswordWrapper(props: {
    kcClsx: KcClsx;
    i18n: I18n;
    passwordInputId: string;
    messagesPerField: any;
}) {
    const { i18n, passwordInputId, messagesPerField } = props;
    const { msgStr } = i18n;

    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer(
        (isPasswordRevealed: boolean) => !isPasswordRevealed,
        false
    );

    useEffect(() => {
        const passwordInputElement = document.getElementById(passwordInputId);
        assert(passwordInputElement instanceof HTMLInputElement);
        passwordInputElement.type = isPasswordRevealed ? "text" : "password";
    }, [isPasswordRevealed]);

    return (
        <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={msgStr("password")}
            type={isPasswordRevealed ? "text" : "password"}
            id={passwordInputId}
            autoComplete="current-password"
            error={messagesPerField.existsError("username", "password")}
            helperText={
                messagesPerField.existsError("username", "password")
                    ? kcSanitize(messagesPerField.getFirstError("username", "password"))
                    : ""
            }
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                            onClick={toggleIsPasswordRevealed}
                            edge="end"
                        >
                            {isPasswordRevealed ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
}