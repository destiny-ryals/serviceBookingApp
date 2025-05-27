import { useState, useEffect } from "react"
import { getProfiles } from "../api"
import CategoryList from "./Categories"
import { ProviderCard } from "./ProvidersCard"

export default function UserHome() {
  const [profiles, setProfiles] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [formattedServices, setFormattedServices] = useState([])

  useEffect(() => {
    async function loadAllProfiles() {
        const response = await getProfiles()
        setProfiles(response)

        const allServices = response.flatMap(profile => {
          if (Array.isArray(profile.services)) {
            return profile.services
          } else if (typeof profile.services === "string") {
            return [profile.services]
          } else {
            return []
          }
        })
        const uniqueServices = [...new Set(allServices)]
        const formatted = [
          { id: -1, name: "All" }, 
          ...uniqueServices.map((service, index) => ({
            id: index,
            name: service
          }))
        ]

        setFormattedServices(formatted)
    }

    loadAllProfiles()
  }, [])

  function handleCategorySelect(categoryName) {
    console.log("Selected Category:", categoryName)
    setSelectedCategory(categoryName)
  }

  const filteredProfiles = selectedCategory === "All" ? profiles
  : profiles.filter(profile => {
      if (Array.isArray(profile.services)) {
        return profile.services.includes(selectedCategory)
      } else if (typeof profile.services === "string") {
        return profile.services === selectedCategory
      }
      return false
    })

  return (
    <div>
      <h1>Welcome, User</h1>
      <CategoryList services={formattedServices} onSelectCategory={handleCategorySelect} />
     {filteredProfiles.map(profile => (
  <ProviderCard key={profile._id} providersProfile={profile} />
))}
    </div>
  )
}

//USERS
        // categories for the different services provided
        

        // so you can click and see all providers that service hair, nails, etc
        // cards for each provider profile 