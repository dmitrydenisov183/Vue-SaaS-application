<template>
  <v-container class="pr-0 pr-md-16" fluid>
    <v-row>
      <v-col cols="12" class="pt-0">
        <div class="metrics__title mb-0">
          <div ref="inboxemail" class="font-weight-bold">{{ inbox.email }}</div>
          <inbox-control :inbox="inbox" class="py-0" @changed="$emit('changed', $event)" show-status />
          <v-divider />
        </div>
      </v-col>
    </v-row>
    <v-row class="metrics__data data">
      <v-col class="pr-lg-10" cols="12" md="6" lg="4" >
        <div class="d-inline-block float-lg-left pr-4 pr-sm-10 pr-md-5 pr-lg-0">
          <div class="data__title">Sending</div>
          <v-divider class="mb-2 mt-1" />
          <div class="data__wrapper">
            <div class="data__value">{{ inbox.sending.today }}</div>
            <div class="data__info">Sent today</div>
          </div>
          <div class="data__wrapper">
            <div class="data__value">{{ inbox.sending.last_7 }}</div>
            <div class="data__info">Sent last 7 days</div>
          </div>
          <div class="data__wrapper">
            <div class="data__value">{{ inbox.sending.last_30 }}</div>
            <div class="data__info">Sent last 30 days</div>
          </div>
        </div>
        <div class="d-inline-block float-lg-right pl-0 pl-sm-10 pl-md-5 pl-lg-0">
          <div class="data__title">Receiving</div>
          <v-divider class="mb-2 mt-1" />
          <div class="data__wrapper">
            <div class="data__value">{{ inbox.receiving.today }}</div>
            <div class="data__info">Received today</div>
          </div>
          <div class="data__wrapper">
            <div class="data__value">{{ inbox.receiving.last_7 }}</div>
            <div class="data__info">Received last 7 days</div>
          </div>
          <div class="data__wrapper">
            <div class="data__value">{{ inbox.receiving.last_30 }}</div>
            <div class="data__info">Received last 30 days</div>
          </div>
        </div>
      </v-col>
      <v-col class="px-lg-10" cols="12" md="6" lg="4" >
        <div class="data__title">Inbox vs Spam</div>
        <v-divider class="mb-6 mt-1" />
        <div class="d-flex flex-column flex-sm-row justify-lg-space-between">
          <div class="data__doughnut-chart d-flex justify-center d-sm-block">
            <doughnut-chart :chart-data="doughnutChartData" :options="doughnutOptions" />
          </div>
          <div class="d-flex justify-space-between align-center mt-5 mt-sm-0 d-sm-block ml-10 ml-lg-0">
            <div class="data__doughnut-legend-inbox mb-sm-8 d-inline-block d-sm-block">
              <div class="data__doughnut-legend-inbox-title font-weight-bold">
                {{ inbox.inbox_v_spam.inbox_percent }} ({{ inbox.inbox_v_spam.inbox_count }})
              </div>
              <div>Landed in <br /> Inbox</div>
            </div>
            <div class="data__doughnut-legend-spam d-inline-block d-sm-block">
              <div class="data__doughnut-legend-spam-title font-weight-bold">
                {{ inbox.inbox_v_spam.spam_percent }} ({{ inbox.inbox_v_spam.spam_count }})
              </div>
              <div>Landed in <br /> Spam & Saved</div>
            </div>
          </div>
        </div>
      </v-col>
      <v-col class="pl-lg-10" cols="12" lg="4" >
        <div class="data__title d-flex justify-space-between align-end">
          Health Score
          <a
            :href="`${baseUrl}/improve-your-deliverability-score`"
            target="blank"
            class="float-right title-link"
          >
            Learn More
          </a>
        </div>
        <v-divider class="mb-2 mt-1" />
        <div class="data__wrapper">
          <div :class="`data__value value--${scoreVariant}`">
            {{ inbox.basic_health.score }}/{{ inbox.basic_health.out_of }}
          </div>
          <div class="data__info">
            {{ inbox.basic_health.last_checked_string }}
          </div>
        </div>
        <div class="data__title mt-9">Listed On Any Blacklists</div>
        <v-divider class="mb-2 mt-1" />
        <div class="data__wrapper">
          <div class="data__value">
            {{ inbox.blacklists.count }}
          </div>
          <div class="data__info">
            {{ inbox.blacklists.last_checked_string }}
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row class="metrics__data data">
      <v-col cols="12" class="pt-10">
        <div class="data__title">
          Inbox Activity
          <div class="float-right">
            <edit-schedule-modal :inbox="inbox" @updated="$emit('schedule-updated')" />
          </div>
        </div>
        <v-divider class="mb-6 mt-1" />
        <v-row>
          <v-col cols="12" md="10">
            <custom-bar-chart
              :key="chartRenderKey"
              :chartdata="computedChartData"
              :options="barChartOptions"
              :height="100"
            />
          </v-col>
          <v-col cols="12" md="2">
            <div class="font-weight-bold mb-3">{{ currentDate }}</div>
            <div class="chart-legend d-flex align-center" @click="isScheduledVisible = !isScheduledVisible">
              <div class="chart-legend__icon">
                <base-icon
                  v-if="isScheduledVisible"
                  class="d-inline-block d-fle pl-0 pt-0 pb-0"
                >
                  mdi-check
                </base-icon>
              </div>
              <div class="chart-legend__wrapper scheduled d-inline-block">
                <div class="chart-legend__value">{{ currentScheduled }}</div>
                <div class="chart-legend__name">Scheduled</div>
              </div>
            </div>
            <div class="chart-legend d-flex align-center" @click="isLandedInInboxVixible = !isLandedInInboxVixible">
              <div class="chart-legend__icon">
                <base-icon
                  v-if="isLandedInInboxVixible"
                  class="d-inline-block d-fle pl-0 pt-0 pb-0"
                >
                  mdi-check
                </base-icon>
              </div>
              <div class="chart-legend__wrapper landed-inbox d-inline-block">
                <div class="chart-legend__value">{{ currentLandedInInbox }}</div>
                <div class="chart-legend__name">Landed in inbox</div>
              </div>
            </div>
            <div class="chart-legend d-flex align-center" @click="isLandedInSpamVisible = !isLandedInSpamVisible">
              <div class="chart-legend__icon">
                <base-icon
                  v-if="isLandedInSpamVisible"
                  class="d-inline-block d-fle pl-0 pt-0 pb-0"
                >
                  mdi-check
                </base-icon>
              </div>
              <div class="chart-legend__wrapper landed-spam d-inline-block">
                <div class="chart-legend__value">{{ currentLandedInSpam }}</div>
                <div class="chart-legend__name">Landed in <br /> Spam & Saved</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import EditScheduleModal from '@/components/modals/EditScheduleModal.vue'
import Inbox from '@/types/Inbox'
import InboxControl from '@/components/InboxControl.vue'
import CustomBarChart, { BarChartEventBus } from '@/components/charts/CustomBarChart.vue'

@Component({ components: { DoughnutChart, EditScheduleModal, CustomBarChart, InboxControl } })
export default class InboxMetrics extends Vue {
  @Prop({
    type: Object as () => Inbox
  })
  readonly inbox!: Inbox

  isScheduledVisible = true;
  isLandedInInboxVixible = true
  isLandedInSpamVisible = true
  currentIndex = -1
  chartRenderKey = 1

  doughnutChartData = {
    labels: ['Inbox', 'Spam'],
    datasets: [
      {
        data: [
          this.inbox.inbox_v_spam.inbox_percent,
          this.inbox.inbox_v_spam.spam_percent
        ],
        backgroundColor: [
          '#9BCAA0',
          '#E19695'
        ],
        borderColor: [
          '#9BCAA0',
          '#E19695'
        ],
        borderWidth: 1
      }
    ]
  }

  doughnutOptions = {
    legend: false,
    plugins: { lineOnHoverPlugin: false },
    tooltips: {
      mode: 'label',
      callbacks: {
        // eslint-disable-next-line
        label: function (tooltipItem: any, data: any) {
          const dataset = data.datasets[tooltipItem.datasetIndex]
          const value = dataset.data[tooltipItem.index]
          const label = data.labels[tooltipItem.index]
          return `${label} (${value} %)`
        }
      }
    }
  }

  barChartData = {
    labels: this.labels,
    datasets: [
      {
        label: ['Inboxes'],
        backgroundColor: '#9BCAA0',
        data: this.inboxesChartData,
        type: 'bar'
      },
      {
        label: ['Spam'],
        backgroundColor: '#E19695',
        data: this.spamChartData,
        type: 'bar'
      },
      {
        label: ['Scheduled'],
        backgroundColor: '#303234',
        data: this.scheduledChartData,
        type: 'bar'
      }
    ]
  }

  barChartOptions = {
    legend: false,
    tooltips: {
      enabled: false,
      mode: 'index',
      intersect: false
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          gridLines: {
            display: false
          },
          ticks: {
            callback: function (value: any) {
              return value.split(',')[0]
            }
          }
        }
      ],
      yAxes: [
        {
          stacked: true
        }
      ]
    }
  }

  get labels (): string[] {
    return Object.values(this.inbox.chart).map(day => Object.keys(day)[0])
  }

  get inboxesChartData (): number[] {
    return Object.values(this.inbox.chart).map(day => Object.values(day)[0].inbox)
  }

  get spamChartData (): number[] {
    return Object.values(this.inbox.chart).map(day => Object.values(day)[0].spam)
  }

  get scheduledChartData (): number[] {
    return Object.values(this.inbox.chart).map(day => Object.values(day)[0].scheduled)
  }

  get scoreVariant (): string | void {
    if (this.inbox.basic_health.score > 0 && this.inbox.basic_health.score <= 6) return 'danger'
    if (this.inbox.basic_health.score > 6 && this.inbox.basic_health.score <= 8) return 'warning'
    if (this.inbox.basic_health.score > 8) return 'success'

    return 'normal'
  }

  get baseUrl (): string {
    return process.env.VUE_APP_BASE_URL
  }

  get computedChartData () {
    const newChartData = { labels: this.barChartData.labels, datasets: [] }
    if (this.isLandedInInboxVixible) newChartData.datasets.push(this.barChartData.datasets[0] as never)
    if (this.isLandedInSpamVisible) newChartData.datasets.push(this.barChartData.datasets[1] as never)
    if (this.isScheduledVisible) newChartData.datasets.push(this.barChartData.datasets[2] as never)

    return newChartData
  }

  get currentDate (): string {
    return this.barChartData.labels[this.currentIndex] ? this.barChartData.labels[this.currentIndex] : '-'
  }

  get currentLandedInInbox (): number | string {
    return this.barChartData.datasets[0].data[this.currentIndex]
      ? this.barChartData.datasets[0].data[this.currentIndex]
      : '0'
  }

  get currentLandedInSpam (): number | string {
    return this.barChartData.datasets[1].data[this.currentIndex]
      ? this.barChartData.datasets[1].data[this.currentIndex]
      : '0'
  }

  get currentScheduled (): number | string {
    return this.barChartData.datasets[2].data[this.currentIndex]
      ? this.barChartData.datasets[2].data[this.currentIndex]
      : '0'
  }

  changeCurrentIndex (index: number): void {
    this.currentIndex = index
  }

  mounted () {
    BarChartEventBus.$on('bar-hover', (barIndex: number) => {
      this.changeCurrentIndex(barIndex)
    })
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    #doughnut-chart {
      max-width: 150px;
      max-height: 150px;
    }
  }

  .value {
    &--normal {
      color: $color-shark;
    }
    &--danger {
      color: $color-petit-orchid;
    }
    &--warning {
      color: $color-tan-hide;
    }
    &--success {
      color: $color-spring-rain;
    }
  }

  .chart-legend {
    padding: 8px 12px;
    border-radius: 3px;
    border: 1px solid transparent;
    &:hover {
      background-color: #E6E6E8;
      border: 1px solid #979797;
      cursor: pointer;
    }
    &__wrapper {
      border-left: 6px solid;
      padding-left: 10px;
      &.shceduled {
        border-color: $color-shark;
      }
      &.landed-spam {
        border-color: $color-petit-orchid;
      }
      &.landed-inbox {
        border-color: $color-spring-rain;
      }
    }
    &__icon {
      min-width: 44px;
    }
    &__value {
      font-weight: $font-weight-bold;
    }
    &__name {
      font-size: $font-sm;
    }
  }

  .metrics {
    &__title {
      font-family: $label-font;
      font-size: $font-md-x;
      width: 100%;
    }
    &__data {
      font-family: $label-font;
      .data {
        &__wrapper {
          margin-bottom: 10px;
        }
        &__title {
          font-weight: $font-weight-bold;
          font-size: $font-md-x;
          .title-link {
            font-size: $font-sm;
            color: $color-dodger-blue !important;
            font-weight: $font-weight-bold;
            text-decoration: none;
          }
        }
        &__value {
          font-weight: $font-weight-bold;
          font-size: $font-lg;
        }
        &__doughnut-chart {
          min-width: 150px !important;
        }
        &__doughnut-legend {
          &-inbox {
            padding-left: 10px;
            border-left: 6px solid $color-spring-rain;
            &-title {
              color: $color-spring-rain;
            }
          }
          &-spam {
            padding-left: 10px;
            border-left: 6px solid $color-petit-orchid;
            &-title {
              color: $color-petit-orchid;
            }
          }
        }
      }
    }
  }
</style>
