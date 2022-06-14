import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  // @ts-ignore: Unreachable code error
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

interface filteredProps {
  images: Array<object>
  artist: string
}

export default function Gallery({ images }: { images: Image[] }) {
  const [imageDisplay, setImageDisplay] = useState(images)

  console.log('Main data set: ', images)
  let artistNames = images.map((a) => a.artistName)
  artistNames = [...new Set(artistNames)]
  console.log(artistNames)

  const filteredFunction = (images, artist) => {
    const propsToCheck = ['artistName']
    const filteredResponse = images.filter((o) =>
      propsToCheck.some((k) =>
        String(o[k]).toLowerCase().includes(artist.toLowerCase())
      )
    )
    console.log(filteredResponse)
    setImageDisplay(filteredResponse)
  }

  return (
    <>
      <h1 className="text-center text-4xl font-bold pt-12">
        Next.js/Supabase Image Gallery
      </h1>
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex flex-wrap gap-x-4">
          <button
            onClick={() => setImageDisplay(images)}
            className="rounded-xl bg-white border border-gray-500 py-1 px-3 capitalize hover:bg-gray-400 transition-colors duration-300"
          >
            All
          </button>
          {artistNames.map((artist, index) => (
            <button
              onClick={() => filteredFunction(images, artist)}
              key={index}
              className="rounded-xl bg-white border border-gray-500 py-1 px-3 capitalize hover:bg-gray-400 transition-colors duration-300"
            >
              {artist}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {imageDisplay.map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
        </div>
      </div>
    </>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join('')
}

function BlurImage({ image }: { image: Image }) {
  const [isLoading, setLoading] = useState(true)
  return (
    <a href={image.href} className="group">
      <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
        <Image
          alt=""
          src={image.imageSrc}
          layout="fill"
          objectFit="cover"
          className={cn(
            'group-hover:opacity-75 duration-700 ease-in-out',
            isLoading
              ? 'grayscale blue-2xl scale-100'
              : 'grayscale-0 blue-0 scale-100'
          )}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{image.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{image.username}</p>
    </a>
  )
}

type Image = {
  id: number
  href: string
  imageSrc: string
  name: string
  username: string
  artistName: any
  artist: any
}

export async function getStaticProps() {
  const { data } = await supabaseAdmin.from('images').select('*')
  return {
    props: {
      images: data,
    },
  }
}
