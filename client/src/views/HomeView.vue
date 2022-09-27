<template>
  <v-container>
    <v-alert close-text="Close Alert" color="green accent-4" dark dismissible v-if="this.$route.params.message">
      {{ this.$route.params.message }}
    </v-alert>
  </v-container>
</template>

<script>

  export default {
    name: 'Home',
  }
</script>
