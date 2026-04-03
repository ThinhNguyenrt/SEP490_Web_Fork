import { CommunityPost, PostCommentsResponse } from "@/types/communityPost";
//   {
//     id: "c1",
//     author: "Lê Nguyễn An Nhiên",
//     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=An",
//     content:
//       "Dự án này trông tuyệt quá Cường ơi! Bạn dùng công nghệ gì để làm phần animation vậy?",
//     time: "5 phút trước",
//     likes: 12,
//     replies: [
//       {
//         id: "c2",
//         author: "Phạm Cường",
//         avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cuong",
//         content:
//           "Cảm ơn An nhé! Mình dùng Framer Motion kết hợp với GSAP để xử lý các chuyển động phức tạp đó.",
//         time: "2 phút trước",
//         likes: 5,
//         replies: [
//           {
//             id: "c3",
//             author: "Lê Nguyễn An Nhiên",
//             avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=An",
//             content: "Thảo nào mượt thế, để mình nghiên cứu thêm về GSAP.",
//             time: "Vừa xong",
//             likes: 1,
//             replies: [],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "c4",
//     author: "Trần Minh Tâm",
//     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tam",
//     content: "Bài viết rất hữu ích, hóng phần tiếp theo của bạn.",
//     time: "10 phút trước",
//     likes: 3,
//     replies: [],
//   },
// ];
export const communityPosts: CommunityPost[] = [
  {
    id: 1,
    author: {
      id: 101,
      name: "Google Inc.",
      avatar: "https://img.timviec.com.vn/2020/10/cong-ty-google-1.jpg",
      role: "COMPANY",
    },
    description:
      "Chúng tôi đang tuyển Senior UX/UI Designer làm việc tại Hà Nội.",
    media: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f"],
    favoriteCount: 120,
    commentCount: 32,
    isFavorited: false,
    isSaved: true,
    createdAt: "2026-01-05T08:00:00",
  },

  {
    id: 2,
    author: {
      id: 201,
      name: "Phạm Cường",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "USER",
    },
    description: "Một vài giao diện mình thiết kế cho app fintech 👇",
    media: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
    ],
    favoriteCount: 45,
    commentCount: 10,
    isFavorited: true,
    isSaved: false,
    createdAt: "2026-01-05T08:30:00",
  },

  {
    id: 3,
    author: {
      id: 5,
      name: "Phạm An Nhiên",
      avatar: "https://example.com/avatar.jpg",
      role: "USER",
    },
    description:
      "Portfolio Frontend Developer của mình, rất mong nhận được góp ý.",
    media: [],
    portfolioId: 12,
    portfolioPreview: {
      type: "INTRO",
      variant: "AVATAR_LEFT",
      data: {
        avatar: "https://example.com/avatar.jpg",
        fullName: "Phạm An Nhiên",
        title: "Frontend Developer",
        summary:
          "2 năm kinh nghiệm React Native, xây dựng UI/UX hiện đại cho mobile app.",
      },
    },
    favoriteCount: 78,
    commentCount: 18,
    isFavorited: true,
    isSaved: true,
    createdAt: "2026-01-05T09:00:00",
  },

  {
    id: 4,
    author: {
      id: 202,
      name: "Nguyễn Thảo",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      role: "USER",
    },
    description: "Một vài project tiêu biểu + portfolio chi tiết mình để kèm.",
    media: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f"],
    portfolioId: 15,
    portfolioPreview: {
      type: "PROJECT",
      variant: "GRID",
      data: [
        {
          name: "OmniBank Mobile App",
          description: "Ứng dụng ngân hàng số cho giới trẻ.",
          technology: ["React Native", "Node.js"],
          role: "Frontend Developer",
        },
        {
          name: "OmniBank Admin",
          description: "Trang quản trị ngân hàng.",
          technology: ["React", "Ant Design"],
          role: "Frontend Developer",
        },
      ],
    },
    favoriteCount: 56,
    commentCount: 6,
    isFavorited: false,
    isSaved: false,
    createdAt: "2026-01-05T09:30:00",
  },

  {
    id: 5,
    author: {
      id: 203,
      name: "Lê Minh Quân",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      role: "USER",
    },
    description: "Chia sẻ kỹ năng chính của mình trong portfolio.",
    media: [],
    portfolioId: 18,
    portfolioPreview: {
      type: "SKILL",
      variant: "TAG",
      data: [
        { name: "JavaScript", level: "Advanced" },
        { name: "React", level: "Advanced" },
        { name: "React Native", level: "Intermediate" },
      ],
    },
    favoriteCount: 22,
    commentCount: 3,
    isFavorited: false,
    isSaved: false,
    createdAt: "2026-01-05T10:00:00",
  },
];
export const POST_COMMENTS_MOCK: PostCommentsResponse[] = [
  {
    postId: 1,
    comments: [
      {
        id: 1,
        author: {
          id: 201,
          name: "Phạm Cường",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          role: "COMPANY",
        },
        content: "Vị trí này có nhận remote không ạ?",
        createdAt: "2026-01-05T09:10:00",
        replies: [
          {
            id: 31,
            author: {
              id: 102,
              name: "FPT Software",
              avatar:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjNrth9D12U-w1YDVelzT5eSzetDjf_zGJ4Q&s",
              role: "COMPANY",
            },
            replyToUser: {
              id: 401,
              name: "Trần Huy",
              avatar: "https://randomuser.me/api/portraits/men/77.jpg",
              role: "USER",
            },
            content: "Hiện tại bên mình ưu tiên onsite bạn nhé.",
            createdAt: "2026-01-05T09:20:00",
          },
          {
            id: 31,
            author: {
              id: 102,
              name: "FPT Software",
              avatar:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjNrth9D12U-w1YDVelzT5eSzetDjf_zGJ4Q&s",
              role: "COMPANY",
            },
            replyToUser: {
              id: 401,
              name: "Trần Huy",
              avatar: "https://randomuser.me/api/portraits/men/77.jpg",
              role: "USER",
            },
            content: "Hiện tại bên mình ưu tiên onsite bạn nhé.",
            createdAt: "2026-01-24T06:20:00",
          },
        ],
      },
      {
        id: 2,
        author: {
          id: 202,
          name: "Nguyễn Minh",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg",
          role: "COMPANY",
        },
        content:
          "Mức lương cho Senior khoảng bao nhiêu vậy ạ? Mức lương cho Senior khoảng bao nhiêu vậy ạ?",
        createdAt: "2026-01-05T09:15:00",
        replies: [],
      },
    ],
  },

  {
    postId: 2,
    comments: [
      {
        id: 4,
        author: {
          id: 301,
          name: "Lê Thảo",
          avatar: "https://randomuser.me/api/portraits/women/65.jpg",
          role: "USER",
        },
        content: "Portfolio nhìn rất xịn 👍",
        createdAt: "2026-01-05T10:05:00",
        replies: [
          {
            id: 31,
            author: {
              id: 102,
              name: "FPT Software",
              avatar:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjNrth9D12U-w1YDVelzT5eSzetDjf_zGJ4Q&s",
              role: "COMPANY",
            },
            replyToUser: {
              id: 401,
              name: "Trần Huy",
              avatar: "https://randomuser.me/api/portraits/men/77.jpg",
              role: "USER",
            },
            content: "Cảm ơn bạn nhiều nha 🙏",
            createdAt: "2026-01-05T10:08:00",
          },
        ],
      },
    ],
  },

  {
    postId: 3,
    comments: [
      {
        id: 7,
        author: {
          id: 401,
          name: "Trần Huy",
          avatar: "https://randomuser.me/api/portraits/men/77.jpg",
          role: "USER",
        },
        content: "Sinh viên năm cuối apply được không?",
        createdAt: "2026-01-04T16:45:00",
        replies: [
          {
            id: 31,
            author: {
              id: 102,
              name: "FPT Software",
              avatar:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjNrth9D12U-w1YDVelzT5eSzetDjf_zGJ4Q&s",
              role: "COMPANY",
            },
            replyToUser: {
              id: 401,
              name: "Trần Huy",
              avatar: "https://randomuser.me/api/portraits/men/77.jpg",
              role: "USER",
            },
            content: "Apply thoải mái nha em.",
            createdAt: "2026-01-04T16:55:00",
          },
        ],
      },
    ],
  },
];
