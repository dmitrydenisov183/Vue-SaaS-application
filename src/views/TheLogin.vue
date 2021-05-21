<template>
  <v-container class="py-0 pt-5" fluid>
    <v-row>
      <v-col cols="12">
        <div class="text-right">
          Don't have an account? <router-link to="/sign-up">Sign up</router-link>.
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="login mx-auto pa-4 px-11 mt-3" width="560px" elevation="0">
          <a :href="baseUrl" target="blank">
            <img class="d-block mx-auto mt-4" src="@/assets/img/full-logo.png" alt="">
          </a>
          <v-card-title class="px-2 pb-0 pt-3">
            <div class="login__title text-capitalize">Log in</div>
          </v-card-title>
          <v-divider class="mx-2 my-2" />
          <validation-observer v-slot="{ invalid }" @keydown.enter="onSubmit">
            <v-container class="px-2" fluid>
              <v-row>
                <v-col col="12" class="py-0">
                  <base-alert v-if="isError" variant="error">
                    {{ errorMessage }}
                  </base-alert>
                </v-col>
              </v-row>
              <v-row>
                <v-col col="12" class="py-0">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Email address"
                    rules="required|email"
                    :debounce="500"
                  >
                    <base-input
                      v-model="form.email"
                      custom-label="Email address"
                      :error-messages="errors"
                      type="email"
                    />
                  </validation-provider>
                </v-col>
              </v-row>
              <v-row>
                <v-col col="12" class="py-0">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Password"
                    rules="required"
                    :debounce="500"
                  >
                    <base-input
                      v-model="form.password"
                      custom-label="Password"
                      :error-messages="errors"
                      type="password"
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions class="py-0">
              <base-button
                class="text-capitalize font-weight-bold"
                variant="secondary"
                :disabled="invalid"
                :loading="isLoading"
                @click="onSubmit"
                large
                block
                tile
              >
                Sign in
              </base-button>
            </v-card-actions>
          </validation-observer>
          <v-card-text class="px-2 login__footer">
            <div>
              Don’t have an account? <router-link to="/sign-up">Sign up</router-link>.
            </div>
            <div>
              Forgot your password? <router-link to="/password-reset">Reset your password</router-link>.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import UserLoginForm from '@/types/UserLoginForm'
import RequestStatus from '@/constants/RequestStatus'
import UserRepository from '@/data/repository/UserRepository'
import { FailureResponse, isFailureResponse } from '@/types/Response'
import AuthModule from '@/store/modules/AuthModule'
import { AxiosResponse } from 'axios'
import { getErrorMessage } from '@/utils/misc'

extend('required', required)
extend('email', email)

@Component({ components: { ValidationProvider, ValidationObserver } })
export default class TheLogin extends Vue {
  status: RequestStatus = RequestStatus.Initial
  errorMessage = ''
  form: UserLoginForm = {
    email: '',
    password: ''
  }

  get isError () {
    return this.status === RequestStatus.Error
  }

  get isLoading () {
    return this.status === RequestStatus.Loading
  }

  get baseUrl (): string {
    return process.env.VUE_APP_BASE_URL
  }

  async onSubmit (): Promise<void> {
    if (this.isLoading) return

    this.status = RequestStatus.Loading

    const response = await new UserRepository().login(this.form)

    if (isFailureResponse(response)) {
      this.status = RequestStatus.Error
      this.errorMessage = getErrorMessage(response as FailureResponse)

      setTimeout(() => {
        this.status = RequestStatus.Initial
        this.errorMessage = ''
      }, 5000)

      return
    }

    await AuthModule.login(response as AxiosResponse<{ status: string; key: string }>)
    this.status = RequestStatus.Success
    window.location.href = '/inboxes'
  }
}
</script>

<style lang="scss" scoped>
  .login {
    &__title {
      font-family: $base-font;
      font-size: $font-md-x;
      color: $color-mako;
      font-weight: $font-weight-bold;
    }
    &__footer {
      font-size: $font-sm-x;
      a {
        text-decoration: none;
      }
    }
  }
</style>
