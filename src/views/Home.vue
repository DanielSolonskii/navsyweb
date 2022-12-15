<template>
<!--  <hello-world />-->
  <div>
    <hello-user/>
  </div>
</template>

<script>
  //import HelloWorld from '../components/HelloWorld'
  import HelloUser from "@/components/HelloUser";


  export default {
    name: 'Home',

    components: {
      HelloUser,
      //HelloWorld,
    },
  }
</script>
