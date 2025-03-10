import { Client } from '@notionhq/client';
import type {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse
} from '@notionhq/client/build/src/api-endpoints';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const secret = `${process.env.NOTION_API_SECRET}`;
const notiondb_id = `${process.env.NOTION_USER_STORIES_DB}`;

// function parseMultiSelectOptions(props: NotionDatabaseProperties): ExtractedOptions {
//   const propertyOptions: ExtractedOptions = {};

//   for (const [propertyName, propertyDetails] of Object.entries(props)) {
//     if (propertyDetails.type === 'multi_select') {
//       const multiSelectProperty = propertyDetails as NotionMultiSelectProperty;
      
//       if (multiSelectProperty.multi_select && multiSelectProperty.multi_select.options) {
//         propertyOptions[propertyName] = multiSelectProperty.multi_select.options;
//       } else {
//         propertyOptions[propertyName] = [];
//       }
//     }
//   }
  
//   return propertyOptions;
// }

// async function getDatabaseProperties(notion: Client) {
//   const userStorySchema = await notion.databases.retrieve({
//     database_id: notiondb_id,
//   });
  
//   return parseMultiSelectOptions(userStorySchema.properties)
// }

// async function getDatabaseRecords(notion: Client) {
//   return await notion.databases.query({
//     database_id: notiondb_id,
//     filter: {
//       property: 'Page',
//       multi_select: {
//         contains: 'Sign In'
//       }
//     }
//   });
// }

async function getFilteredDatabaseRecords(notion: Client, property: string, contains: string) {
  return await notion.databases.query({
    database_id: notiondb_id,
    filter: {
      property: property,
      multi_select: {
        contains: contains
      }
    }
  });
}

function processDatabaseRecords(pages: (
  PartialDatabaseObjectResponse |
  DatabaseObjectResponse |
  PageObjectResponse |
  PartialPageObjectResponse
)[]) {
  const processedRecords: {
    id: string;
    action: string;
    elements: string[];
    components: string[];
    modules: string[];
    templates: string[];
    pages: string[];
  }[] = [];
  pages.forEach(p => {
    const action = p.properties['Action'];
    
    const elements = p.properties['Element'].type === 'multi_select' ? 
      p.properties['Element'].multi_select.map((item: { name: string; }) => item.name) : [];
      
    const components = p.properties['Component'].type === 'multi_select' ? 
      p.properties['Component'].multi_select.map((item: { name: string; }) => item.name) : [];
      
    const modules = p.properties['Module'].type === 'multi_select' ? 
      p.properties['Module'].multi_select.map((item: { name: string; }) => item.name) : [];
      
    const templates = p.properties['Template'].type === 'multi_select' ? 
      p.properties['Template'].multi_select.map((item: { name: string; }) => item.name) : [];
      
    const pages = p.properties['Page'].type === 'multi_select' ? 
      p.properties['Page'].multi_select.map((item: { name: string; }) => item.name) : [];

    let actionText = '';
    if (action.type === 'title' && action.title.length > 0) {
      actionText = action.title[0].plain_text;
    }

    processedRecords.push({
      id: p.id,
      action: actionText,
      elements: elements,
      components: components, 
      modules: modules,
      templates: templates,
      pages: pages
    });
  })

  return processedRecords;
};

function generateUserStories(obj: {
  id: string;
  action: string;
  elements: string[];
  components: string[];
  modules: string[];
  templates: string[];
  pages: string[];
}) {
  const { action, components, modules, templates, pages } = obj;
  const stories = [];
  
  // Generate all possible combinations
  for (const component of components) {
    for (const module of modules) {
      for (const template of templates) {
        for (const page of pages) {
          const story = `${action} using the ${component.toLowerCase()} in the ${module.toLowerCase()} module of the ${template.toLowerCase()} flow at ${page.toLowerCase()}`;
          stories.push(story);
        }
      }
    }
  }
  
  return stories;
}

async function main() {
  const notion = new Client({
    auth: secret,
  });

  const stories: string[][] = []

  const filteredActionPages = (await getFilteredDatabaseRecords(notion, 'Page', 'Sign In')).results
  const processedPages = processDatabaseRecords(filteredActionPages);
  // console.log(processedPages)
  processedPages.forEach(p => {
    stories.push(generateUserStories(p))
  });

  console.log(stories)


}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });