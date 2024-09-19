import read from '@/assets/images/media-read.png';
import watch from '@/assets/images/media-watch.png';
import podcast from '@/assets/images/media-podcast.png';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Media() {
	return (
		<div className="space-y-8 px-8 sm:px-12 my-6">
			<h2 className="text-center text-black/80 text-xl sm:text-3xl font-bold">
				News & Media
			</h2>
			<div className="grid sm:grid-cols-3 gap-4 sm:gap-8">
				{data.map((m, i) => (
					<Link
						key={m.title}
						href={m.link}
						className={cn(
							'space-y-4',
							i < 2 ? 'sm:border-r sm:border-gray-200 sm:pr-8' : ''
						)}>
						<h3 className="text-lg text-black/80 sm:text-2xl font-semibold">
							{m.title}
						</h3>
						<div className="flex-1 h-full">
							<Image
								src={m.image}
								alt={m.title}
								width={200}
								height={180}
								objectFit="cover"
								className="w-full h-[180px] rounded"
							/>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}

const data = [
	{
		title: 'Read',
		image: read,
		link: '#',
	},
	{
		title: 'Watch',
		image: watch,
		link: '#',
	},
	{
		title: 'Listen',
		image: podcast,
		link: '#',
	},
];
