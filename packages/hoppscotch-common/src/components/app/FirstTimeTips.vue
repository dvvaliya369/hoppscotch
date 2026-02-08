<template>
  <HoppSmartModal
    v-if="show"
    dialog
    :title="t('first_time_tips.title')"
    @close="skipTips"
  >
    <template #body>
      <div class="flex flex-col space-y-4">
        <!-- Progress indicator -->
        <div class="flex justify-center space-x-2">
          <span
            v-for="(step, index) in steps"
            :key="index"
            class="h-2 w-2 rounded-full transition-colors"
            :class="
              index === currentStep
                ? 'bg-accent'
                : 'bg-divider'
            "
          />
        </div>

        <!-- Current step content -->
        <div class="flex flex-col space-y-2 py-4">
          <div class="flex items-start space-x-3">
            <div
              class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accentLight"
            >
              <component :is="steps[currentStep].icon" class="h-5 w-5 text-accent" />
            </div>
            <div class="flex flex-col space-y-1">
              <h3 class="text-lg font-semibold text-primary">
                {{ t(steps[currentStep].titleKey) }}
              </h3>
              <p class="text-sm text-secondary">
                {{ t(steps[currentStep].descriptionKey) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Step counter -->
        <div class="text-center text-xs text-secondaryLight">
          {{ currentStep + 1 }} / {{ steps.length }}
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-between">
        <HoppButtonSecondary
          :label="t('action.skip')"
          outline
          @click="skipTips"
        />
        <div class="flex space-x-2">
          <HoppButtonSecondary
            v-if="currentStep > 0"
            :label="t('action.previous')"
            outline
            @click="previousStep"
          />
          <HoppButtonPrimary
            v-if="currentStep < steps.length - 1"
            :label="t('action.next')"
            outline
            @click="nextStep"
          />
          <HoppButtonPrimary
            v-else
            :label="t('action.got_it')"
            outline
            @click="finishTips"
          />
        </div>
      </div>
    </template>
  </HoppSmartModal>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useI18n } from "~/composables/i18n"
import IconLucidePlus from "~icons/lucide/plus"
import IconLucideSave from "~icons/lucide/save"
import IconLucideFileInput from "~icons/lucide/file-input"
import IconLucideSettings from "~icons/lucide/settings"

const t = useI18n()

const FIRST_TIME_TIPS_KEY = "hoppscotch_first_time_tips_shown"

const show = ref(false)
const currentStep = ref(0)

interface TipStep {
  titleKey: string
  descriptionKey: string
  icon: any
}

const steps: TipStep[] = [
  {
    titleKey: "first_time_tips.create_request.title",
    descriptionKey: "first_time_tips.create_request.description",
    icon: IconLucidePlus,
  },
  {
    titleKey: "first_time_tips.save_collections.title",
    descriptionKey: "first_time_tips.save_collections.description",
    icon: IconLucideSave,
  },
  {
    titleKey: "first_time_tips.import_file.title",
    descriptionKey: "first_time_tips.import_file.description",
    icon: IconLucideFileInput,
  },
  {
    titleKey: "first_time_tips.use_environments.title",
    descriptionKey: "first_time_tips.use_environments.description",
    icon: IconLucideSettings,
  },
]

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const skipTips = () => {
  show.value = false
  localStorage.setItem(FIRST_TIME_TIPS_KEY, "true")
}

const finishTips = () => {
  show.value = false
  localStorage.setItem(FIRST_TIME_TIPS_KEY, "true")
}

const checkFirstTime = () => {
  const hasSeenTips = localStorage.getItem(FIRST_TIME_TIPS_KEY)
  if (!hasSeenTips) {
    // Show tips after a short delay to allow the app to load
    setTimeout(() => {
      show.value = true
    }, 1000)
  }
}

onMounted(() => {
  checkFirstTime()
})

// Export function to manually trigger the tips (for testing or settings reset)
const showTips = () => {
  currentStep.value = 0
  show.value = true
}

defineExpose({
  showTips,
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
