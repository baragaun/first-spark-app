import {
  ChannelType,
  type Channel,
  type ChannelMessage,
  type MyUser,
} from '@baragaun/bg-node-client';
import type { LayoutLoad } from './$types';

// Only initialize in browser environment
export const ssr = false;

export const load: LayoutLoad = async () => {
  const currentMockUserId = 'u1';

  // Mock users data
  const mockUsers: MyUser[] = [
    {
      id: 'u1',
      email: 'alice@example.com',
      userHandle: 'alice',
      firstName: 'Alice',
      lastName: 'Smith',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEmailVerified: true,
      spokenLanguagesTextIds: [],
      roles: [],
      trustLevel: 1,
    },
    {
      id: 'u2',
      email: 'bob@example.com',
      userHandle: 'bob',
      firstName: 'Bob',
      lastName: 'Johnson',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEmailVerified: true,
      spokenLanguagesTextIds: [],
      roles: [],
      trustLevel: 1,
    },
    {
      id: 'u3',
      email: 'carol@example.com',
      userHandle: 'carol',
      firstName: 'Carol',
      lastName: 'Williams',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEmailVerified: true,
      spokenLanguagesTextIds: [],
      roles: [],
      trustLevel: 1,
    },
    {
      id: 'u4',
      email: 'dave@example.com',
      userHandle: 'dave',
      firstName: 'Dave',
      lastName: 'Brown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEmailVerified: true,
      spokenLanguagesTextIds: [],
      roles: [],
      trustLevel: 1,
    },
  ];

  // Mock channel messages
  const mockMessages: Record<string, ChannelMessage[]> = {
    '1': [
      // Day before yesterday (3 days ago -> 2 days ago)
      {
        id: 'm101',
        channelId: '1',
        createdBy: 'u2',
        messageText: 'Hey, have you started on the project proposal?',
        createdAt: new Date(Date.now() - 172800000 - 86400000).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 172800000 - 86400000).toISOString(),
      },
      {
        id: 'm102',
        channelId: '1',
        createdBy: 'u1',
        messageText: "Not yet, I'm gathering some research first",
        createdAt: new Date(Date.now() - 172800000 - 86300000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000 - 86300000).toISOString(),
      },
      {
        id: 'm103',
        channelId: '1',
        createdBy: 'u2',
        messageText:
          "Good idea. I found some interesting articles we could reference. Although its primary effects were felt in a localized area of India, the outer fringes of the super cyclone impacted Myanmar and Bangladesh. Ten people were killed in the former, while two were killed in the latter by the storm's rainbands. The storm was the most severe to strike Odisha in the 20th century, raking the state and adjacent areas with high storm surge, powerful winds, and torrential rainfall. The storm's impacts exacerbated the damage caused by a very severe cyclone that struck the same region less than two weeks earlier.",
        createdAt: new Date(Date.now() - 172800000 - 86200000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000 - 86200000).toISOString(),
      },
      {
        id: 'm104',
        channelId: '1',
        createdBy: 'u1',
        messageText: 'Great! Could you share them with me?',
        createdAt: new Date(Date.now() - 172800000 - 86100000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000 - 86100000).toISOString(),
      },
      {
        id: 'm105',
        channelId: '1',
        createdBy: 'u2',
        messageText: "Sure, I'll email them to you this evening",
        createdAt: new Date(Date.now() - 172800000 - 86000000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000 - 86000000).toISOString(),
      },

      // Yesterday
      {
        id: 'm106',
        channelId: '1',
        createdBy: 'u2',
        messageText: 'Just sent those articles. Did you get them?',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 'm107',
        channelId: '1',
        createdBy: 'u1',
        messageText: 'Yes, got them. These are really helpful!',
        createdAt: new Date(Date.now() - 172700000).toISOString(),
        updatedAt: new Date(Date.now() - 172700000).toISOString(),
      },
      {
        id: 'm108',
        channelId: '1',
        createdBy: 'u2',
        messageText: 'I thought the third one was particularly relevant to our approach',
        createdAt: new Date(Date.now() - 172600000).toISOString(),
        updatedAt: new Date(Date.now() - 172600000).toISOString(),
      },
      {
        id: 'm109',
        channelId: '1',
        createdBy: 'u1',
        messageText: 'Agreed. I like their methodology section too',
        createdAt: new Date(Date.now() - 172500000).toISOString(),
        updatedAt: new Date(Date.now() - 172500000).toISOString(),
      },
      {
        id: 'm110',
        channelId: '1',
        createdBy: 'u2',
        messageText: 'When do you think we can have a draft ready?',
        createdAt: new Date(Date.now() - 172400000).toISOString(),
        updatedAt: new Date(Date.now() - 172400000).toISOString(),
      },
      {
        id: 'm111',
        channelId: '1',
        createdBy: 'u1',
        messageText: 'I should have something by tomorrow afternoon',
        createdAt: new Date(Date.now() - 172300000).toISOString(),
        updatedAt: new Date(Date.now() - 172300000).toISOString(),
      },

      // Today
      {
        id: 'm112',
        channelId: '1',
        createdBy: 'u1',
        messageText: "Hey, I've started working on the draft",
        createdAt: new Date(Date.now() - 3600000).toISOString(), // Today
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'm113',
        channelId: '1',
        createdBy: 'u2',
        messageText: "That's great! How's it coming along?",
        createdAt: new Date(Date.now() - 3500000).toISOString(),
        updatedAt: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        id: 'm114',
        channelId: '1',
        createdBy: 'u1',
        messageText: "Pretty well. I've outlined the main sections and started on the introduction",
        createdAt: new Date(Date.now() - 3400000).toISOString(),
        updatedAt: new Date(Date.now() - 3400000).toISOString(),
      },
      {
        id: 'm115',
        channelId: '1',
        createdBy: 'u2',
        messageText: 'Perfect. Do you need any help with the technical specifications?',
        createdAt: new Date(Date.now() - 3300000).toISOString(),
        updatedAt: new Date(Date.now() - 3300000).toISOString(),
      },
      {
        id: 'm116',
        channelId: '1',
        createdBy: 'u1',
        messageText: "That would be great. I'm not as familiar with that part",
        createdAt: new Date(Date.now() - 3200000).toISOString(),
        updatedAt: new Date(Date.now() - 3200000).toISOString(),
      },
      {
        id: 'm117',
        channelId: '1',
        createdBy: 'u2',
        messageText:
          "I've been researching the technical specifications for our project, and I wanted to share some detailed findings. The implementation will require a multi-layered architecture with several key components. First, we'll need a robust database system capable of handling high-volume transactions with minimal latency. PostgreSQL seems ideal given its ACID compliance and JSON capabilities. For the backend, we should implement a microservices architecture using containerization for better scalability and maintenance. Each service should handle a specific domain of functionality, communicating through a message broker like RabbitMQ or Kafka. The API layer should follow RESTful principles with proper versioning and comprehensive documentation using OpenAPI specifications. For real-time features, we'll need WebSocket integration, possibly with Socket.IO or a similar library. The frontend should be built with a component-based framework that supports server-side rendering for better SEO and initial load performance. We should implement proper state management patterns and ensure accessibility compliance throughout the UI. Security is critical, so we'll need to implement OAuth 2.0 with JWT for authentication, proper input validation, CSRF protection, and regular security audits. For deployment, we should set up a CI/CD pipeline with automated testing at multiple levels: unit, integration, and end-to-end. Infrastructure should be defined as code using tools like Terraform, with monitoring and logging systems in place from the start. Performance optimization will be crucial, including CDN integration, asset minification, lazy loading, and database query optimization. I've prepared a more detailed document with specific library recommendations and implementation strategies that I can share with you tomorrow. Let me know if you have any specific questions about any of these aspects.",
        createdAt: new Date(Date.now() - 3100000).toISOString(),
        updatedAt: new Date(Date.now() - 3100000).toISOString(),
      },
    ],
    '2': [
      {
        id: 'm201',
        channelId: '2',
        createdBy: 'u2',
        messageText: 'Did you see the latest update?',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'm202',
        channelId: '2',
        createdBy: 'u3',
        messageText: 'Yes, it looks great! I especially like the new features.',
        createdAt: new Date(Date.now() - 7100000).toISOString(),
        updatedAt: new Date(Date.now() - 7100000).toISOString(),
      },
    ],
    '3': [
      {
        id: 'm301',
        channelId: '3',
        createdBy: 'u3',
        messageText: 'Thanks for your help yesterday!',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 'm302',
        channelId: '3',
        createdBy: 'u2',
        messageText: 'No problem at all, happy to help.',
        createdAt: new Date(Date.now() - 172700000).toISOString(),
        updatedAt: new Date(Date.now() - 172700000).toISOString(),
      },
      {
        id: 'm303',
        channelId: '3',
        createdBy: 'u3',
        messageText: 'Let me know if you need anything else!',
        createdAt: new Date(Date.now() - 172600000).toISOString(),
        updatedAt: new Date(Date.now() - 172600000).toISOString(),
      },
    ],
    '4': [
      {
        id: 'm401',
        channelId: '4',
        createdBy: 'u4',
        messageText: 'Are we still meeting tomorrow?',
        createdAt: new Date(Date.now() - 86500000).toISOString(),
        updatedAt: new Date(Date.now() - 86500000).toISOString(),
      },
      {
        id: 'm402',
        channelId: '4',
        createdBy: 'u1',
        messageText: 'Yes, 2pm works for me.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'm403',
        channelId: '4',
        createdBy: 'u2',
        messageText: 'No problem at all, 2pm not works for me.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  };

  // Mock channels
  const mockChannels: Channel[] = [
    {
      id: '1',
      createdAt: new Date(Date.now() - 4000000).toISOString(),
      updatedAt: new Date(Date.now() - 3400000).toISOString(),
      channelType: ChannelType.unset,
      participants: [
        {
          id: '1p',
          userId: 'u1',
          channelId: '1',
          createdAt: new Date(Date.now() - 4000000).toISOString(),
        },
        {
          id: '2p',
          userId: 'u2',
          channelId: '1',
          createdAt: new Date(Date.now() - 4000000).toISOString(),
        },
      ],
    },
    {
      id: '2',
      createdAt: new Date(Date.now() - 8000000).toISOString(),
      updatedAt: new Date(Date.now() - 7100000).toISOString(),
      channelType: ChannelType.unset,
      participants: [
        {
          id: '3p',
          userId: 'u1',
          channelId: '2',
          createdAt: new Date(Date.now() - 8000000).toISOString(),
        },
        {
          id: '4p',
          userId: 'u3',
          channelId: '2',
          createdAt: new Date(Date.now() - 8000000).toISOString(),
        },
      ],
    },
    {
      id: '3',
      name: 'First Spark Support',
      description: 'We would like to help you!',
      createdAt: new Date(Date.now() - 180000000).toISOString(),
      updatedAt: new Date(Date.now() - 172600000).toISOString(),
      channelType: ChannelType.unset,
      participants: [
        {
          id: '5p',
          userId: 'u3',
          channelId: '3',
          createdAt: new Date(Date.now() - 180000000).toISOString(),
        },
        {
          id: '6p',
          userId: 'u4',
          channelId: '3',
          createdAt: new Date(Date.now() - 180000000).toISOString(),
        },
        {
          id: '11p',
          userId: 'u1',
          channelId: '3',
          createdAt: new Date(Date.now() - 180000000).toISOString(),
        },
      ],
    },
    {
      id: '4',
      name: 'Team Chat',
      description: 'General team chat',
      createdAt: new Date(Date.now() - 90000000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      channelType: ChannelType.support,
      participants: [
        {
          id: '7p',
          userId: 'u1',
          channelId: '4',
          createdAt: new Date(Date.now() - 90000000).toISOString(),
        },
        {
          id: '8p',
          userId: 'u2',
          channelId: '4',
          createdAt: new Date(Date.now() - 90000000).toISOString(),
        },
        {
          id: '9p',
          userId: 'u3',
          channelId: '4',
          createdAt: new Date(Date.now() - 90000000).toISOString(),
        },
        {
          id: '10p',
          userId: 'u4',
          channelId: '4',
          createdAt: new Date(Date.now() - 90000000).toISOString(),
        },
      ],
    },
  ];

  return {
    currentMockUserId,
    users: mockUsers,
    channels: mockChannels,
    messages: mockMessages,
  };
};
