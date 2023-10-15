import { useEffect, useState } from "react"

export const useSearch = <T extends { name: string }>(data?: T[]) => {
  const [searchInput, setSearchInput] = useState<string>("")
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }
  const [filteredData, setFilteredData] = useState<T[]>([])

  useEffect(() => {
    if (!searchInput) {
      setFilteredData(data ?? [])
    } else {
      setFilteredData(
        data?.filter(f =>
          f.name.toLowerCase().includes(searchInput.toLowerCase())
        ) ?? []
      )
    }
  }, [searchInput, data])

  return {
    filteredData,
    searchInput,
    handleSearchInputChange,
  }
}
