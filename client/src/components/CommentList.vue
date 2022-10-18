<template>
  <v-list v-if="data.length !== 0">
    <template v-for="(comment, i) in data">
      <v-comment
        :data="comment"
        :remark-codes="remarkCodes"
        editable
        @updated="updateData"
      />
      <v-divider v-if="i < data.length - 1" :key="i"></v-divider>
    </template>
  </v-list>
</template>

<script>
import Comment from "@/components/Comment";

export default {
  name: "v-comment-list",
  props: {
    data: {
      type: Array,
    },
    remarkCodes: {
      type: Array,
    },
  },
  methods: {
    updateData() {
      console.log("caught event, emitting from CommentList");
      this.$emit("update-data");
    },
  },
  components: {
    "v-comment": Comment,
  },
};
</script>
