<template>
  <div>
    test
    <h2>test</h2>
    test 2
  </div>
</template>
<script>
export default {
  methods: {
    getUserInfo(name) {
      const HelloStr = 'Hello, your name is: ';
      const age = 22;
      return HelloStr + name;
    }
  }
};
</script>
