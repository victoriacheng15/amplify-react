import { useState, useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage } from "aws-amplify";
import {
	Button,
	Flex,
	Heading,
	Image,
	Text,
	TextField,
	View,
	withAuthenticator,
} from "@aws-amplify/ui-react";
// @ts-ignore
import { listNotes } from "./graphql/queries";
import {
	createNote as createNoteMutation,
	deleteNote as deleteNoteMutation,
	// @ts-ignore
} from "./graphql/mutations";

// @ts-ignore
// rome-ignore lint/suspicious/noExplicitAny: <explanation>
function App({ signOut }: any) {
	const [notes, setNotes] = useState([]);

	useEffect(() => {
		fetchNotes();
	}, []);

	async function fetchNotes() {
		const apiData = await API.graphql({ query: listNotes });
		// @ts-ignore
		const notesFromAPI = apiData.data.listNotes.items;
		await Promise.all(
			// @ts-ignore
			notesFromAPI.map(async (note) => {
				if (note.image) {
					const url = await Storage.get(note.name);
					note.image = url;
				}
				return note;
			}),
		);
		setNotes(notesFromAPI);
	}
	// @ts-ignore
	async function createNote(event) {
		event.preventDefault();
		const form = new FormData(event.target);
		const image = form.get("image");
		const data = {
			name: form.get("name"),
			description: form.get("description"),
			// @ts-ignore
			image: image.name,
		};
		// @ts-ignore
		if (!!data.image) await Storage.put(data.name, image);
		await API.graphql({
			query: createNoteMutation,
			variables: { input: data },
		});
		fetchNotes();
		event.target.reset();
	}
	// @ts-ignore
	async function deleteNote({ id, name }) {
		// @ts-ignore
		const newNotes = notes.filter((note) => note.id !== id);
		setNotes(newNotes);
		await Storage.remove(name);
		await API.graphql({
			query: deleteNoteMutation,
			variables: { input: { id } },
		});
	}

	return (
		<View className="App">
			<Heading level={1}>My Notes App</Heading>
			<View as="form" margin="3rem 0" onSubmit={createNote}>
				<Flex direction="row" justifyContent="center">
					<TextField
						name="name"
						placeholder="Note Name"
						label="Note Name"
						labelHidden
						variation="quiet"
						required
					/>
					<TextField
						name="description"
						placeholder="Note Description"
						label="Note Description"
						labelHidden
						variation="quiet"
						required
					/>
					<View
						name="image"
						as="input"
						type="file"
						style={{ alignSelf: "end" }}
					/>
					<Button type="submit" variation="primary">
						Create Note
					</Button>
				</Flex>
			</View>
			<Heading level={2}>Current Notes</Heading>
			<View margin="3rem 0">
				{notes.map((note) => (
					<Flex
					// @ts-ignore
						key={note.id || note.name}
						direction="row"
						justifyContent="center"
						alignItems="center"
					>
						<Text as="strong" fontWeight={700}>
							{/* @ts-ignore */}
							{note.name}
						</Text>
						{/* @ts-ignore */}
						<Text as="span">{note.description}</Text>
						{/* @ts-ignore */}
						{note.image && (
							<Image
							// @ts-ignore
								src={note.image}
								// @ts-ignore
								alt={`visual aid for ${notes.name}`}
								style={{ width: 400 }}
							/>
						)}
						<Button variation="link" onClick={() => deleteNote(note)}>
							Delete note
						</Button>
					</Flex>
				))}
			</View>
			<Button onClick={signOut}>Sign Out</Button>
		</View>
	);
}

export default withAuthenticator(App);
