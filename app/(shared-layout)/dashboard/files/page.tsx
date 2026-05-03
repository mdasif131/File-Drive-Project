import FileBrowser from "@/components/web/file-browser"
import { auth } from "@clerk/nextjs/server"
const FilePage = async () => {
  const { isAuthenticated, redirectToSignIn} = await auth()
  if (!isAuthenticated) return redirectToSignIn()
  return (
    <div>
      <FileBrowser title={"Your Files"} />
    </div>
  )
}

export default FilePage
