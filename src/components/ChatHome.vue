<template>
  <div class="join-container">
    <header class="join-header">
      <h1>
        <i class="fas fa-smile"></i> My Chat
      </h1>
    </header>
    <div v-if="!logged" class="join-main">
      <form @submit.prevent="Login">
        <div class="form-group">
          <label for="inputState">User Name:</label>
          <input
            id="inputState"
            type="text"
            class="form-control"
            v-model="user"
            placeholder="Enter Your Name"
            required
          />
        </div>
        <button type="submit" class="btn">Join Chat</button>
      </form>
    </div>
    <div v-else>
      <h2>{{welcomeMessage}}</h2>
      <div class="messages">
        <h4 v-for="(message , index) in newUserJoinAndLeftMessage" :key="index">{{message}}</h4>
        <p v-for="(data , index) in messages" :key="index">
          <span>{{data.user}}</span>
          {{data.message}}
        </p>
        <form @submit.prevent="sendMessage">
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              v-model="message"
              placeholder="Enter Your Message"
              required
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import io from "socket.io-client";

  export default {
    data() {
      return {
        user: "",
        selectedRoom: "",
        welcomeMessage: "",
        newUserJoinAndLeftMessage: [],
        logged: false,
        message: "",
        messages: [],
        socket: io("http://localhost:3000/")
      };
    },
    methods: {
      Login() {
        this.socket.emit("SEND_USER", this.user, this.selectedRoom);

        this.socket.on("WELCOME", message => {
          this.welcomeMessage = message;
        });

        this.logged = !this.logged;

        this.socket.on("NEW_USER_JOIN", joinMessage => {
          this.newUserJoinAndLeftMessage.push(joinMessage);
        });

        this.socket.on("USER_LEFT", leftMessage => {
          this.newUserJoinAndLeftMessage.push(leftMessage);
        });
      },
      sendMessage() {
        console.log(this.message);
        this.socket.emit("SEND_MESSAGE", {
          user: this.user,
          message: this.message
        });
        this.message = "";
      }
    },
    mounted() {
      this.socket.on("MESSAGE", data => {
        this.messages = [...this.messages, data];
        // you can also do this.messages.push(data)
      });
    }
  };
</script>

<style scoped>
  .join-container {
    max-width: 500px;
    margin: 80px auto;
    /* color: #fff; */
  }
  .join-header {
    background: #667aff;
    text-align: center;
    padding: 20px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .join-main {
    background: #7386ff;
    padding: 30px 40px;
  }
  .join-main p {
    margin-bottom: 20px;
  }
  .join-main .form-control {
    margin-bottom: 20px;
  }
  .join-main label {
    display: block;
    margin-bottom: 5px;
  }
  .join-main input[type="text"] {
    font-size: 16px;
    padding: 5px;
    height: 40px;
    width: 100%;
  }
  .join-main select {
    font-size: 16px;
    padding: 5px;
    height: 40px;
    width: 100%;
  }
  .join-main .btn {
    margin-top: 20px;
    width: 100%;
  }

  .messages {
    height: 80%;
    overflow-y: scroll;
  }

  .messages input {
    position: fixed;
    bottom: 0;
  }
</style>