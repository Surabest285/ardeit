
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCourseTags = (courseIds: string[]) => {
  const [courseTags, setCourseTags] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourseTags = async () => {
      try {
        if (courseIds.length > 0) {
          const { data, error } = await supabase
            .from('course_tags_mapping')
            .select(`
              course_id,
              tag:tag_id(id, name)
            `)
            .in('course_id', courseIds);
            
          if (error) {
            console.error('Error fetching course tags:', error);
          } else if (data) {
            const tagsByCourse: Record<string, string[]> = {};
            data.forEach(item => {
              if (item.tag && item.course_id) {
                if (!tagsByCourse[item.course_id]) {
                  tagsByCourse[item.course_id] = [];
                }
                tagsByCourse[item.course_id].push(item.tag.name);
              }
            });
            setCourseTags(tagsByCourse);
          }
        }
      } catch (error) {
        console.error('Exception fetching course tags:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseTags();
  }, [courseIds]);
  
  return { courseTags, loading };
};
