import { ref } from "vue"
import { getService } from "~/modules/dioc"
import { PersistenceService } from "~/services/persistence"

const FIRST_TIME_TIPS_KEY = "first_time_tips_dismissed"

const showFirstTimeTips = ref(false)

export async function useFirstTimeTips() {
  const persistenceService = getService(PersistenceService)

  const dismissed = await persistenceService.getLocalConfig(FIRST_TIME_TIPS_KEY)

  if (!dismissed) {
    showFirstTimeTips.value = true
  }
}

export function getShowFirstTimeTips() {
  return showFirstTimeTips
}

export async function dismissFirstTimeTips() {
  const persistenceService = getService(PersistenceService)

  showFirstTimeTips.value = false
  await persistenceService.setLocalConfig(FIRST_TIME_TIPS_KEY, "true")
}
