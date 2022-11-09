<template>
  <v-list v-if="data.length !== 0">
    <div v-for="(comment, i) in data" :key="comment.id">
      <v-comment
        :data="comment"
        :remark-codes="remarkCodes"
        :editable="editableIf()"
        @updated="updateData"
      />
      <v-divider v-if="i < data.length - 1" :key="i"></v-divider>
    </div>
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
    editableIf: {
      type: Function,
      default: () => false,
    },
  },
  methods: {
    updateData() {
      this.$emit("update-data");
    },
  },
  components: {
    "v-comment": Comment,
  },
};
</script>
