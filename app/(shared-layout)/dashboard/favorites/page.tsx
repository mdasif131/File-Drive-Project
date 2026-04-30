import FileBrowser from "@/components/web/file-browser"

const FavoritesPage = () => {
  return (
    <div>
      <div>
        <FileBrowser title="Favorite Files" favorites />
      </div>
    </div>
  )
}

export default FavoritesPage