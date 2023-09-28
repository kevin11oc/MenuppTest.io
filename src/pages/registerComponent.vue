<template>
  <div class="q-app">
    <q-layout view="lHh Lpr lFf">
      <q-page-container>
        <q-page class="flex flex-center bg-dark">
          <q-card class="q-pa-md shadow-2 my_card" bordered>
            <q-card-section class="text-center">
              <div class="text-grey-9 text-h5 text-weight-bold">Registro</div>
            </q-card-section>
            <q-card-section>
              <q-input
                dense
                outlined
                v-model="username"
                label="nombre usuario"
              ></q-input>
              <q-input
                dense
                outlined
                class="q-mt-md"
                v-model="email"
                label="Correo electrónico"
              ></q-input>
              <q-input
                dense
                outlined
                class="q-mt-md"
                v-model="password"
                type="password"
                label="Contraseña"
              ></q-input>
              <q-input
                dense
                outlined
                class="q-mt-md"
                v-model="confirmPassword"
                type="password"
                label="Confirmar Contraseña"
              ></q-input>
            </q-card-section>
            <q-card-section>
              <q-btn
                style="border-radius: 8px"
                color="dark"
                rounded
                size="md"
                label="Registrarse"
                no-caps
                class="full-width"
                @click="register"
              ></q-btn>
            </q-card-section>
            <q-card-section class="text-center q-pt-none">
              <div class="text-grey-8">
                Ya tienes una cuenta?
                <a
                  href="/#/login"
                  class="text-dark text-weight-bold"
                  style="text-decoration: none"
                  >Iniciar sesión</a
                >
              </div>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
export default defineComponent({
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        return;
      }
      const auth = getAuth();

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        console.log('Registro exitoso:', userCredential.user);
        this.$router.push('/login');
      } catch (error) {
        this.errorMessage =
          'Error al registrar. Verifica tus datos e intenta nuevamente.';
        console.error('Error de registro:', error);
      }
    },
  },
});
</script>

<style>
.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
