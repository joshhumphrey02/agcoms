'use client';
import Link from 'next/link';
import { Button } from '../ui/button';
import SearchForm from './search';
import NavMenu from './nav-menu';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import logo from '@/assets/Agcoms Logo.png';
import Image from 'next/image';
import { ChevronUp, MapPin, User2 } from 'lucide-react';
import { animateScroll } from 'react-scroll';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import Sidebar from './sidebar';

gsap.registerPlugin(ScrollTrigger);

export default function Header() {
	const headerRef = useRef<HTMLDivElement>(null);
	const [isFixed, setIsFixed] = useState(false);

	useGSAP(() => {
		const headerEl = headerRef.current;

		const handleScroll = () => {
			const scrollTop = window.scrollY || document.documentElement.scrollTop;

			if (scrollTop > 100 && !isFixed) {
				setIsFixed(true);
				gsap.to(headerEl, {
					position: 'fixed',
					top: 0,
					y: 0,
					duration: 0.9,
					backgroundColor: '#d5d5d5',
					ease: 'power1.out',
				});
			} else if (scrollTop <= 50 && isFixed) {
				setIsFixed(false);
				gsap.to(headerEl, {
					position: 'relative',
					y: 0,
					duration: 0.9,
					ease: 'power1.out',
					boxShadow: 'none',
				});
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [isFixed]);

	const options = {
		duration: 3000,
		smooth: 'easeInOutQuad',
	};
	return (
		<div className="flex flex-col">
			<div
				ref={headerRef}
				className={cn(
					'grid',
					isFixed ? ' w-screen bg-[#d5d5d5] z-50 left-0' : ''
				)}>
				<div
					className={cn(
						'flex h-12 sm:h-[4.5rem] w-full items-center gap-4 py-0 px-4 md:px-6 sm:border-b bg-background',
						isFixed ? 'max-w-[1350px] mx-auto' : ''
					)}>
					<Link href={'/'}>
						<Image
							src={logo}
							style={{ width: 'auto', height: 45 }}
							className="w-32 object-cover filter brightness-75"
							alt="Agcoms logo"
						/>
					</Link>
					<div className="ml-auto flex space-x-4 flex-1 justify-end sm:flex-initial items-center h-full">
						<SearchForm containerClassName="hidden sm:block" />
						<Button className=" p-0 sm:px-4 hover:bg-gray-100 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-transparent text-black">
							<Link
								href={'#'}
								className="flex space-x-2 items-center text-sm text-gray-600">
								<MapPin />
								<span className="hidden sm:flex">Locate a Dealer</span>
							</Link>
						</Button>
						<div className="hidden sm:flex h-[60%] w-px bg-gray-300" />
						<Button className=" p-0 sm:px-4 hover:bg-gray-100 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-transparent text-black">
							<Link
								href={'/digital'}
								className="flex space-x-2 items-center text-sm text-gray-600">
								<User2 />
								<span className="hidden sm:flex">Sign in</span>
							</Link>
						</Button>
						<Sidebar />
					</div>
				</div>
				<div
					className={cn(
						'bg-gray-300 w-full px-4 py-2 block sm:hidden',
						isFixed ? 'max-w-[1350px] mx-auto' : ''
					)}>
					<SearchForm className="bg-white text-black border border-black flex-row-reverse" />
				</div>
				<NavMenu
					className={cn(
						'hidden sm:flex h-10 w-full items-center gap-4 border-b bg-background px-4 md:px-6',
						isFixed ? 'max-w-[1350px] mx-auto' : ''
					)}
				/>
			</div>
			{isFixed && (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								onClick={() => animateScroll.scrollToTop(options)}
								variant={'ghost'}
								className="rounded-full bg-white hover:bg-green-600 shadow-md z-40 hover:text-white text-green-600 p-1 px-2.5 fixed bottom-6 right-6">
								<ChevronUp className="w-5 h-5" strokeWidth={3} />
							</Button>
						</TooltipTrigger>
						<TooltipContent className="bg-black text-white">
							<p className="text-xs">Back to the Top</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</div>
	);
}

/*
<AccordionItem key={hf.title + i} value={`item-${i}`}>
												<AccordionTrigger
													isPlus={true}
													className="text-md  hover:bg-gray-200 font-medium gap-2 border-b hover:no-underline px-2 ">
													<span className="flex-1 text-sm text-gray-500 flex justify-start">
														{hf.title}
													</span>
												</AccordionTrigger>
												<AccordionContent className="grid gap-2 px-8 py-4">
													{hf.sub.map((sub, i) => (
														<div key={i + sub.title}>
															<Link
																href={`${sub.link}`}
																className="focus:text-green-600 pb-1 w-full hover:text-green-600 border-b border-gray-200 text-sm font-medium">
																{sub.title}
															</Link>
														</div>
													))}
												</AccordionContent>
											</AccordionItem>
*/
