<template>
  <header>
    <h1>NATIVE STATS</h1>
    <div class="auth-buttons">
      <button>Register</button>
      <button>Login</button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
header {
  background: #000;
  color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
header h1 {
  font-size: 20px;
  margin: 0;
  font-weight: 600;
}
.auth-buttons button {
  background: #fff;
  color: #000;
  border: none;
  margin-left: 10px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 3px;
}
.auth-buttons button:hover {
  background: #ddd;
}
</style>
