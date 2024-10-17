import { backend } from 'declarations/backend';

let quill;
let currentPostId = null;

document.addEventListener('DOMContentLoaded', async () => {
  quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean']
      ]
    }
  });

  const newPostBtn = document.getElementById('newPostBtn');
  const postForm = document.getElementById('postForm');
  const blogPostForm = document.getElementById('blogPostForm');
  const cancelBtn = document.getElementById('cancelBtn');

  newPostBtn.addEventListener('click', () => {
    showForm('Create New Post');
  });

  blogPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const body = quill.root.innerHTML;

    if (currentPostId === null) {
      await backend.createPost(title, body, author);
    } else {
      await backend.updatePost(currentPostId, title, body, author);
    }

    hideForm();
    await loadPosts();
  });

  cancelBtn.addEventListener('click', hideForm);

  await loadPosts();
});

async function loadPosts() {
  const posts = await backend.getPosts();
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';

  posts.forEach(post => {
    const postElement = document.createElement('article');
    postElement.className = 'post';
    postElement.innerHTML = `
      <h2>&gt; ${post.title}</h2>
      <p class="author">By: ${post.author}</p>
      <div class="content">${post.body}</div>
      <p class="timestamp">Timestamp: ${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</p>
      <button class="editBtn" data-id="${post.id}">Edit</button>
    `;
    postsContainer.appendChild(postElement);

    const editBtn = postElement.querySelector('.editBtn');
    editBtn.addEventListener('click', () => editPost(post));
  });
}

function editPost(post) {
  showForm('Edit Post');
  currentPostId = post.id;
  document.getElementById('title').value = post.title;
  document.getElementById('author').value = post.author;
  quill.root.innerHTML = post.body;
}

function showForm(title) {
  document.getElementById('formTitle').textContent = `> ${title}_`;
  document.getElementById('postForm').style.display = 'block';
  document.getElementById('blogPostForm').reset();
  quill.setContents([]);
  currentPostId = null;
}

function hideForm() {
  document.getElementById('postForm').style.display = 'none';
  document.getElementById('blogPostForm').reset();
  quill.setContents([]);
  currentPostId = null;
}
