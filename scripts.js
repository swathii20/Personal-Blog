document.addEventListener("DOMContentLoaded", () => {
  loadPosts();

  document.getElementById("post-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const summary = document.getElementById("summary").value;
    const content = document.getElementById("content").value;
    const imageFile = document.getElementById("imageFile").files[0];

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function () {
        const imageData = reader.result;
        savePost(title, summary, content, imageData);
      };
      reader.readAsDataURL(imageFile);
    } else {
      const placeholderImage = "https://via.placeholder.com/600x300?text=No+Image";
      savePost(title, summary, content, placeholderImage);
    }
  });
});

function savePost(title, summary, content, image) {
  const newPost = {
    id: Date.now(),
    title,
    summary,
    content,
    image
  };

  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.unshift(newPost);
  localStorage.setItem("posts", JSON.stringify(posts));

  document.getElementById("post-form").reset();
  loadPosts();
}

function loadPosts() {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const container = document.getElementById("posts-container");
  container.innerHTML = "";

  posts.forEach((post) => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    col.innerHTML = `
      <div class="card">
        <img src="${post.image}" class="card-img-top" alt="${post.title}">
        <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${post.summary}</p>
          <button class="btn btn-secondary mb-2" onclick="alert('${escapeQuotes(post.content)}')">Read More</button>
          <button class="btn btn-danger" onclick="deletePost(${post.id})">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function deletePost(id) {
  if (confirm("Are you sure you want to delete this post?")) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts = posts.filter(post => post.id !== id);
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
  }
}
