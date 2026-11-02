// export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:2000').replace(/\/$/, '');
export const API_URL = (import.meta.env.VITE_API_URL || 'https://genealogy-server.onrender.com').replace(/\/$/, '');
export async function apiFetch(user, path, options = {}) {
	const send = async forceRefresh => fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			...(options.body instanceof FormData ? {} : { 'content-type': 'application/json' }),
			...options.headers,
			authorization: `Bearer ${await user.getIdToken(forceRefresh)}`,
		},
	});
	let response = await send(false);
	if (response.status === 401) response = await send(true);
	const result = await response.json().catch(() => ({}));
	if (!response.ok) throw new Error(result.message || 'Request সম্পন্ন করা যায়নি।');
	return result;
}

export async function readTree(user, language) {
	const endpoint = language === 'bangla' ? 'genealogyBangla' : 'genealogyEnglish';
	const records = await apiFetch(user, `/${endpoint}`);
	if (!records[0]?.name || !Array.isArray(records[0].children)) {
		throw new Error('Family tree data is missing or invalid in the database.');
	}
	return records[0];
}

export function flattenParents(root) {
	const parents = [];
	function visit(node, path = [], ancestors = []) {
		if (!node || !Array.isArray(node.children)) return;
		const lineage = [...ancestors, node.name];
		parents.push({ path, name: node.name, label: lineage.join(' → ') });
		node.children.forEach((child, index) => visit(child, [...path, index], lineage));
	}
	visit(root);
	return parents;
}
