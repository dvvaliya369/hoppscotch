import { useFirstTimeTips } from "~/composables/first-time-tips"
import { HoppModule } from "."

export default <HoppModule>{
  onRootSetup() {
    useFirstTimeTips()
  },
}
