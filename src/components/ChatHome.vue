<template>
  <div class="chat">
    <div class="card border-0">
      <!-- Chat Header Section -->
      <header class="card-header rounded-0 px-2">
        <div class="d-flex">
          <div>
            <h5 class="mb-0 font-weight-bold">
              <i class="fas fa-smile text-info"></i> My Chat
            </h5>
          </div>
          <div class="ml-auto">
            <h6 class="mb-0">{{welcomeMessage}}</h6>
          </div>
        </div>
      </header>
      <!-- Card body for user name input -->
      <div v-if="!logged" class="card-body join-box">
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
          <button type="submit" class="btn float-right">Join Chat</button>
        </form>
      </div>
      <!-- After entering in chat  -->
      <div v-else class="card-body message-box my-5">
        <div class="messages px-2 px-lg-5">
          <p
            v-for="(data , index) in messages"
            :key="index"
            :class="data.type != 'message' ? 'text-danger' : ''"
          >
            <span v-if="data.type == 'message'">{{data.user}}:</span>
            {{data.message}}
          </p>
        </div>
        <!-- Message Form -->
        <div class="form-box px-2 px-lg-5 py-2">
          <form @submit.prevent="sendMessage">
            <div class="form-group mb-0">
              <input
                type="text"
                v-model="message"
                class="form-control border-0 shadow-none"
                placeholder="Enter Your Message"
                required
              />
            </div>
          </form>
          <i class="fas fa-paper-plane text-primary"></i>
        </div>
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
        welcomeMessage: "",
        logged: false,
        message: "",
        messages: [],
        socket: io("http://localhost:3000/")
      };
    },
    methods: {
      Login() {
        // Track the user
        this.socket.emit("SEND_USER", this.user);

        this.socket.on("WELCOME", message => {
          this.welcomeMessage = message;
        });

        // Event on new user join
        this.socket.on("NEW_USER_JOIN", (message, type) => {
          let newObject = {
            message,
            type
          };
          this.messages.push(newObject);
        });

        // Message Option enabled
        this.logged = !this.logged;

        // Event on User leaving
        this.socket.on("USER_LEFT", (message, type) => {
          let newObject = {
            message,
            type
          };
          this.messages.push(message, newObject);
        });
      },

      // Event on message send
      sendMessage() {
        this.socket.emit("SEND_MESSAGE", {
          user: this.user,
          message: this.message
        });
        this.message = "";
      }
    },
    mounted() {
      // Handle all message
      this.socket.on("MESSAGE", (data, type) => {
        let { user, message } = data;
        let newObject = {
          user,
          message,
          type
        };
        this.messages = [...this.messages, newObject];
      });
    }
  };
</script>

<style scoped>
  .chat .card .card-header {
    width: 100%;
    top: 0;
    left: 0;
    position: fixed;
    background: #ffffff;
    z-index: 999;
  }
  .chat .messages {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 95vh;
    padding-top: 60px;
    padding-bottom: 60px;
    overflow-y: scroll;
  }
  .chat .card .form-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #ffffff;
    z-index: 999;
  }
  .chat .card .form-box .form-control {
    border-radius: 25px;
    font-size: 14px;
    height: 40px;
    padding-left: 15px;
    background: rgba(85, 85, 85, 0.144);
  }
  .chat .form-control:focus {
    box-shadow: none;
  }

  @media (max-width: 576px) {
    .chat .card .form-box .form-control {
      padding-right: 45px;
    }
    .chat .card .form-box i {
      position: absolute;
      top: 18px;
      right: 25px;
      font-size: 20px;
    }
    .chat .card .join-box {
      padding-top: 150px;
      width: 90vw;
      margin: auto;
    }
  }

  @media (min-width: 576px) {
    .chat .card .form-box .form-control {
      padding-right: 45px;
    }
    .chat .card .form-box i {
      position: absolute;
      top: 18px;
      right: 65px;
      font-size: 20px;
    }
    .chat .card .join-box {
      padding-top: 150px;
      width: 450px;
      margin: auto;
    }
  }

  @media (min-width: 992px) {
    .chat .card .card-header,
    .chat .card .message-box,
    .chat .card .message-box .messages,
    .chat .card .form-box {
      padding-left: 300px !important;
      padding-right: 300px !important;
    }
    .chat .card .form-box i {
      position: absolute;
      top: 18px;
      right: 320px;
      font-size: 20px;
    }
  }
</style>