INSERT INTO models (name, tech_name) VALUES ('Chat GPT 3.5-turbo', 'gpt-3.5-turbo'), ('Chat GPT 4', 'gpt-4');
INSERT INTO msg_roles (name) VALUES ('system'), ('user'), ('assistant');

INSERT INTO folders (name, user_id) VALUES 
	('Test Folder1', 'user_2VP0ILQP8B8gz9xRcfjalh4Vhpn'),
	('FolderFold2', 'user_2VP0ILQP8B8gz9xRcfjalh4Vhpn');

INSERT INTO agents (user_id, name, model_id, system_prompt, temperature) VALUES
	('user_2VP0ILQP8B8gz9xRcfjalh4Vhpn', 'General', 1, 'You are assistant, answer as you know', 17);
INSERT INTO agent_has_folders (agent_id, folder_id) VALUES
	(1, 1);