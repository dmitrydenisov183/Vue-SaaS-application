<template>
  <v-container class="py-0 pt-15" fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="reset mx-auto pa-5 px-11 mt-3" width="560px" elevation="0">
          <img class="d-block mx-auto mt-4" src="@/assets/img/full-logo.png" alt="">
          <v-card-title class="px-2">
            <div class="reset__title mb-2">Password Reset</div>
            <div class="reset__sub-title">
              Enter your email address below and we will send you a link for a password reset.
            </div>
          </v-card-title>
          <validation-observer v-slot="{ invalid }" @keydown.enter="onSubmit">
            <validation-provider
              v-slot="{ errors }"
              name="Email address"
              rules="required|email"
              :debounce="500"
            >
              <base-input
                v-model="email"
                :error-messages="errors"
                custom-label="Email address"
                class="px-2"
              />
            </validation-provider>
            <v-card-actions class="py-0">
              <base-button
                class="text-capitalize font-weight-bold mt-1"
                variant="secondary"
                :disabled="invalid"
                :loading="isLoading"
                large
                block
                tile
                @click="onSubmit"
              >
                Send password reset
              </base-button>
            </v-card-actions>
          </validation-observer>
          <v-card-text class="px-2 reset__footer">
            <div>
              <router-link to="/login">Back to login</router-link>
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
import RequestStatus from '@/constants/RequestStatus'
import UserRepository from '@/data/repository/UserRepository'
import { FailureResponse, isFailureResponse } from '@/types/Response'
import { getErrorMessage, sendFlashMessage } from '@/utils/misc'

extend('required', required)
extend('email', email)

@Component({ components: { ValidationObserver, ValidationProvider } })
export default class ThePasswordReset extends Vue {
  email = ''
  status: RequestStatus = RequestStatus.Initial

  get isLoading (): boolean {
    return this.status === RequestStatus.Loading
  }

  async onSubmit (): Promise<void> {
    if (this.isLoading) return

    this.status = RequestStatus.Loading

    const response = await new UserRepository().passwordResetRequest(this.email)

    if (isFailureResponse(response)) {
      this.status = RequestStatus.Error
      sendFlashMessage({
        status: 'error',
        message: getErrorMessage(response as FailureResponse)
      })

      return
    }

    this.status = RequestStatus.Success
    this.$router.push({ name: 'login' })

    sendFlashMessage({
      status: 'success',
      message: 'If we have your email address on file, we will email you a password reset link.'
    })
  }
}
</script>

<style lang="scss" scoped>
  .reset {
    &__title {
      font-family: $base-font;
      font-size: $font-lg-x;
      color: $color-mako;
    }
    &__sub-title {
      font-family: $base-font;
      color: $color-oslo-gray;
      font-size: $font-md;
      line-height: 24px;
    }
    &__footer {
      a {
        text-decoration: none;
      }
    }
  }
</style>
