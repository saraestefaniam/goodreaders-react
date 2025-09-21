import type { RootState } from "../index";

export const selectIsLogged = (state: RootState) => 
    Boolean(state.auth.token)
