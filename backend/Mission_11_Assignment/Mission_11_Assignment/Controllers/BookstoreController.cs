using Microsoft.AspNetCore.Mvc;
using Mission_11_Assignment.Data;

namespace Mission_11_Assignment.Controllers;

[ApiController]
[Route("[controller]")]
public class BookstoreController : ControllerBase
{

    private BookstoreDbContext _context;

    public BookstoreController(BookstoreDbContext temp)
    {
        _context = temp;
    }

    // HttpGet Logic for the API
    [HttpGet("Books")]
    public IActionResult GetBooks(
        int pageNum = 1,
        int pageSize = 5,
        string sortBy = "title",
        string? category = null)
    {
        var query = _context.Books.AsQueryable();

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }
        
        // Sorting
        query = sortBy.ToLower() switch
        {
            "title" => query.OrderBy(b => b.Title),
            "" => query,
            _ => query.OrderBy(b => b.BookId)
        };
        
        var totalCount = query.Count();

        // Grabs applicable data for the page
        var books = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        // Creates an anonymous object to return the books and total count
        var bookItem = new
        {
            books,
            totalCount
        };

        return Ok(bookItem);
    }

    [HttpGet("Categories")]
    public IActionResult GetCategories()
    {
        var categories = _context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToList();
        
        return Ok(categories);
    }

    // Add a new book
    [HttpPost("Books")]
    public IActionResult AddBook([FromBody] Book book)
    {
        _context.Books.Add(book);
        _context.SaveChanges();
        return Ok(book);
    }
    
    // Update an existing book
    [HttpPut("Books/{id}")]
    public IActionResult UpdateBook(int id, [FromBody] Book book)
    {
        var existing = _context.Books.Find(id);
        if (existing == null) return NotFound();

        existing.Title = book.Title;
        existing.Author = book.Author;
        existing.Publisher = book.Publisher;
        existing.ISBN = book.ISBN;
        existing.Classification = book.Classification;
        existing.Category = book.Category;
        existing.PageCount = book.PageCount;
        existing.Price = book.Price;
        
        _context.SaveChanges();
        return Ok(existing);
    }
    
    // Remove a book from the store
    [HttpDelete("Books/{id}")]
    public IActionResult DeleteBook(int id)
    {
        var book = _context.Books.Find(id);
        if (book == null) return NotFound();

        _context.Books.Remove(book);
        _context.SaveChanges();
        return NoContent();
    }
}