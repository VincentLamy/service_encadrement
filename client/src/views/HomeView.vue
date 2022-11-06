<template>
  <v-container>
    <v-alert close-text="Close Alert" color="green accent-4 red--text" type="success" text dark dismissible
      v-if="this.$route.params.response && this.$route.params.response.code != 'ERR_BAD_REQUEST'">
      {{ this.$route.params.response.message }}
    </v-alert>
    <v-alert close-text="Close Alert" color="red accent-4 red--text" type="error" text dark dismissible
      v-if="this.$route.params.response && this.$route.params.response.code == 'ERR_BAD_REQUEST'">
      {{ this.$route.params.response.response.data.message }}
    </v-alert>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
}
</script>
