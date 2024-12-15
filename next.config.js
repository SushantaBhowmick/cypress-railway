/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        serverActions:true,
    },
    images:{
        domains:['wjezhnezszbacbkgxswr.supabase.co']
    }
}

module.exports = nextConfig
