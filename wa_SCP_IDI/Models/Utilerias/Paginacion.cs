using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace wa_SCP_IDI.Models.Utilerias
{
    public class Paginacion<T> : List<T>
    {
        public int PageIndex { get; set; }
        public int TotalPages { get; set; }
        public int TotalR { get; set; }

        public Paginacion(List<T> items, int count, int pageIndex, int pageSize)
        {
            PageIndex = pageIndex;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            TotalR = count;
            this.AddRange(items);
        }
        public bool HasPreviousPage
        {
            get
            { return (PageIndex > 1); }

        }
        public bool HasNextPage
        {
            get
            {
                return (PageIndex < TotalPages);
            }
        }
        public static  Paginacion<T> CreateAsync(IQueryable<T> source, int pageIndex, int pageSize)
        {
            int count = 0;
            List<T> items = null;
            try
            {
                count = source.Count();// .CountAsync();
                items = source.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
            }
            catch (Exception)
            {
                throw;
            }
            return new Paginacion<T>(items, count, pageIndex, pageSize);
        }
    }
}
