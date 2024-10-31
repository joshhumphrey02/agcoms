'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MessageFormInput, MessageFormSchema } from '@/lib/validators/auth';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { saveRequest } from '@/lib/actions/request-actions';

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export default function ContactForm({
	className,
	...props
}: UserAuthFormProps) {
	const form = useForm<MessageFormInput>({
		resolver: zodResolver(MessageFormSchema),
		defaultValues: {
			fullName: '',
			email: '',
			phone: '',
			town: '',
			message: '',
			allowMarketing: false,
		},
	});
	const [loading, setLoading] = React.useState(false);
	const [state, dispatch] = useFormState(saveRequest, undefined);

	async function handleSubmit(data: MessageFormInput) {
		setLoading(true);
		dispatch(data);
	}
	React.useEffect(() => {
		if (state?.formError) {
			toast.error(state.formError);
		}
		if (state?.data) {
			toast.success('Request sent successfully!');
			form.reset();
			setLoading(false);
		}
		setLoading(false);
	}, [state?.formError, state?.fieldError, state?.data]);
	return (
		<>
			<div
				className={cn(
					'grid gap-6 max-w-lg w-full mx-auto bg-white shadow-md rounded px-4 py-6',
					className
				)}>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<div className="grid gap-4">
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Fullname<sup className="text-red-500">*</sup>
										</FormLabel>
										<FormControl>
											<Input placeholder="Your fullname" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Email<sup className="text-red-500">*</sup>
										</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="Your email address"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Phone Number<sup className="text-red-500">*</sup>
										</FormLabel>
										<FormControl>
											<Input placeholder="Your phone number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="town"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Location</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="Please enter your location"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Message<sup className="text-red-500">*</sup>
										</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="Please enter your message"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								disabled={loading}
								className="mt-4 bg-blue-600 text-white hover:border transition-colors duration-700 hover:border-blue-600 hover:text-black hover:bg-transparent"
								type="submit">
								{loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
								Continue
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
}
