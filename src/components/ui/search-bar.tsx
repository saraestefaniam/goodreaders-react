import type React from "react"
import { useState } from "react"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({onSearch}) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} style={{display: "flex", gap:"0.5rem"}}>
      <input
        type="text"
        placeholder="Buscar libros"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button type="submit">Buscar</button>
    </form>
  )
}