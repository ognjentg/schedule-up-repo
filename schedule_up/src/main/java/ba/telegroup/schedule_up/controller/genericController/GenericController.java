package ba.telegroup.schedule_up.controller.genericController;


import ba.telegroup.schedule_up.common.exceptions.BadRequestException;
import ba.telegroup.schedule_up.common.exceptions.ForbiddenException;
import ba.telegroup.schedule_up.controller.genericLogger.GenericLogger;
import ba.telegroup.schedule_up.session.UserBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.Serializable;
import java.util.List;

/**
 * Created by drstjepanovic on 7/22/2017.
 */

/*
    I replaced findOne method with findById because findOne says it only takes Object of type T and finds by Example.
    We will see if it works.
 */
public class GenericController<T, ID extends Serializable> extends GenericLogger<T> {

    protected JpaRepository<T, ID> repo;
    @PersistenceContext
    private EntityManager entityManager;

    @Value("${badRequest.insert}")
    private String badRequestInsert;

    @Value("${badRequest.update}")
    private String badRequestUpdate;

    @Value("${badRequest.delete}")
    private String badRequestDelete;

    @Autowired
    protected  UserBean userBean;
    public GenericController(JpaRepository<T, ID> repo) {
        this.repo = repo;
    }

    @Transactional
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List<T> getAll()throws BadRequestException,ForbiddenException {
        return repo.findAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody
    T findById(@PathVariable("id") ID id) throws BadRequestException,ForbiddenException {
        //  return repo.findOne(id);
        return repo.findById(id).orElse(null);
    }

    @Transactional
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    T insert(@RequestBody T object) throws BadRequestException,ForbiddenException {
        T ret = null;
        if ((ret = repo.saveAndFlush(object)) != null) {
            entityManager.refresh(ret);
            logCreateAction(object);
            return ret;
        }
        throw new BadRequestException(badRequestInsert);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    String update(@PathVariable ID id, @RequestBody T object) throws BadRequestException,ForbiddenException {
        T oldObject = cloner.deepClone(repo.findById(id).orElse(null));
        if (repo.saveAndFlush(object) != null) {
            logUpdateAction(object, oldObject);
            return "Success";
        }
        throw new BadRequestException(badRequestUpdate);
    }

    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable ID id) throws BadRequestException,ForbiddenException {
        try {
            T object = repo.findById(id).orElse(null);
            // repo.delete(id);
            repo.deleteById(id);
            logDeleteAction(object);
            return "Success";
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new BadRequestException(badRequestDelete);
        }
    }

}


    /*
    @RequestMapping(method = RequestMethod.DELETE)

    public @ResponseBody
    String delete(@PathVariable ID id) {
        try {
            repo.delete(id);
            return "Success";
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }*/

//    @RequestMapping(method = RequestMethod.DELETE)
//    public @ResponseBody
//    String delete(@RequestBody ID object) {
//        try {
//            repo.delete(object);
//            return "Success";
//        } catch (Exception ex) {
//            ex.printStackTrace();
//            return null;
//        }
//    }