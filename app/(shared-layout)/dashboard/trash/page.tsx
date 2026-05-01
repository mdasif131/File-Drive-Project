import FileBrowser from "@/components/web/file-browser"

const TrashPage = () => {
  return (
    <div>
      <FileBrowser title="Trash File" deletedOnly/>
    </div>
  )
}

export default TrashPage