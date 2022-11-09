import { defineStore } from 'pinia'

export const useAuthenticationStore = defineStore('authentication', {
    state: () => ({
        first_name: "",
        last_name: "",
        departement: "",
        type: "",
        is_activated: false,
    }),

    getters: {
        get_first_name: (state) => state.first_name,
        get_last_name: (state) => state.last_name,
        get_departement: (state) => state.departement,
        get_type: (state) => state.type,
        get_is_activated: (state) => state.is_activated,
    },

    actions: {
        set_first_name(first_name) {
            this.first_name = first_name
        },
        set_last_name(last_name) {
            this.last_name = last_name
        },
        set_departement(departement) {
            this.departement = departement
        },
        set_type(type) {
            this.type = type
        },
        set_is_activated(is_activated) {
            this.is_activated = is_activated
        }
    }
})