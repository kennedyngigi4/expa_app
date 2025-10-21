
export const APIServices = {
    post: async function(url:string, token: string, formData: FormData): Promise<any>{
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/${url}`, {
                method: "POST",
                headers: {
                    "Authorization": `Token ${token}`,
                },
                body: formData,
            });
            
            
            const res = await response.json();
            console.log(res);
            
            
            if(!response.ok){
                return { "success": false, "message": res.message, }
            }

            return res;
        } catch(e){
            return { "success": false, "message": "An error occurred.", }
        }
    },

    get: async function (url: string, token: string): Promise<any> {
        try{    
            const res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/${url}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                }
            });

            
            const data = await res.json();
            
            if(!res.ok){
                return { "success": false, "message": "Something went wrong.", }
            }

            return data;

        } catch(e){
            return { "success": false, "message": "An error occurred.", }
        }
    },

    patch: async function (url: string, token: string, formData: FormData): Promise<any> {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/${url}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Token ${token}`,
                },
                body: formData,
            });
            const data = await res.json()

            if (!res.ok) {
                return { "success": false, "message": "Something went wrong.", }
            }

            return { "success": true, };
            
        } catch(e){
            return { "success": false, "message": "An error occurred.", }
        }
    },


    delete: async function (url: string, token: string): Promise<any> {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/${url}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                }
            });
            const data = await res.json();

            if (!res.ok) {
                return { "success": false, "message": "Something went wrong.", }
            }

            return data;
        } catch(e){
            return { "success": false, "message": "An error occurred.", }
        }
    },


    intracity: async function(url: string, token: string, data: any): Promise<any>{
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/${url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
                body: JSON.stringify(data)
            });

            const response = await res.json();

            if(!res.ok){
                return response;
            }

            

            return response;
        } catch (e) {
            return { "success": false, "message": "An error occurred, " + e, }
        }
    }
}