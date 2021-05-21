<template>
  <v-container class="py-0 pt-15" fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="verify mx-auto pa-6 px-11 mt-3" width="560px" elevation="0">
          <img class="d-block mx-auto mt-4" src="@/assets/img/full-logo.png" alt="">
          <v-card-title class="px-2 mb-1">
            <div class="verify__title mb-2">Please verify your email address.</div>
            <div class="verify__sub-title">
              We just sent a verification code to {{ userEmail }}. Please enter the code below to verify your account.
            </div>
          </v-card-title>
          <validation-observer v-slot="{ invalid }" @keydown.enter="onSubmit">
            <validation-provider
              v-slot="{ errors }"
              name="code"
              rules="required"
              :debounce="500"
            >
              <base-input
                v-model="code"
                :error-messages="errors"
                custom-label="Code"
                class="mb-1 px-2"
              />
            </validation-provider>
            <v-card-actions class="py-0">
              <base-button
                class="text-capitalize font-weight-bold"
                variant="secondary"
                :disabled="invalid"
                :loading="isLoading"
                large
                block
                tile
                @click="onSubmit"
              >
                Verify
              </base-button>
            </v-card-actions>
          </validation-observer>
          <v-card-text class="verify__footer px-2">
            <div>
              <a v-if="!isResendLoading" @click="onResendCode">Resend code</a>
              <v-progress-circular
                v-else
                :width="2"
                size="20"
                color="primary"
                indeterminate
              ></v-progress-circular>
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
import { required } from 'vee-validate/dist/rules'
import RequestStatus from '@/constants/RequestStatus'
import UserRepository from '@/data/repository/UserRepository'
import { FailureResponse, isFailureResponse } from '@/types/Response'
import { getErrorMessage, sendFlashMessage } from '@/utils/misc'
import AuthModule from '@/store/modules/AuthModule'

extend('required', required)

@Component({ components: { ValidationObserver, ValidationProvider } })
export default class TheEmailVerification extends Vue {
  status: RequestStatus = RequestStatus.Initial
  resendStatus: RequestStatus = RequestStatus.Initial
  code = ''

  get isLoading (): boolean {
    return this.status === RequestStatus.Loading
  }

  get isResendLoading (): boolean {
    return this.resendStatus === RequestStatus.Loading
  }

  get userEmail (): string {
    return AuthModule.userEmail ? AuthModule.userEmail : 'your email address'
  }

  async onSubmit (): Promise<void> {
    if (this.isLoading) return

    this.status = RequestStatus.Loading

    const response = await new UserRepository().verifyEmail(this.code)

    if (isFailureResponse(response)) {
      this.status = RequestStatus.Error
      sendFlashMessage({
        status: 'error',
        message: getErrorMessage(response as FailureResponse)
      })

      return
    }

    await AuthModule.getUser()
    this.status = RequestStatus.Success
    this.$router.push({ name: 'inboxes' })
  }

  async onResendCode (): Promise<void> {
    if (this.isResendLoading) return

    this.resendStatus = RequestStatus.Loading

    const response = await new UserRepository().resendCode()

    if (isFailureResponse(response)) {
      this.resendStatus = RequestStatus.Error
      sendFlashMessage({
        status: 'error',
        message: getErrorMessage(response as FailureResponse)
      })

      return
    }

    this.resendStatus = RequestStatus.Success
    sendFlashMessage({
      status: 'success',
      message: 'We just resent your verification code. Please check your email.'
    })
  }
}
</script>

<style lang="scss" scoped>
  .verify {
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
