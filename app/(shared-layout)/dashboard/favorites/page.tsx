import FileBrowser from "@/components/web/file-browser"

const FavoritesPage = () => {
  return (
    <div>
      <div>
        <FileBrowser title="Favorite Files" favoritesOnly />
      </div>
    </div>
  )
}

export default FavoritesPage