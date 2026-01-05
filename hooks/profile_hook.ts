import useSWR from "swr"
import { useSession } from "next-auth/react"

const fetcher = (url: string) =>
    fetch(url).then(res => {
        if (!res.ok) throw new Error("Profile fetch failed")
        return res.json()
    })

export function useProfile() {
    const { status } = useSession()

    const { data, error, isLoading } = useSWR(
        status === "authenticated" ? "/api/profile/" : null,
        fetcher,
        {
            dedupingInterval: 60_000,
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    )

    return { profile: data, isLoading, error }
}
